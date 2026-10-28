import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem("nexus_chat_username") || "Krishna";
    } catch {
      return "Krishna";
    }
  });

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      username: "NexusBot",
      message: "👋 Welcome to the real-time collaboration stream! Messages sync across all browser tabs via WebSockets.",
      timestamp: "System"
    }
  ]);
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("nexus_chat_username", username);
    } catch {
      // Ignore
    }
  }, [username]);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setSocketId(socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setSocketId(null);
    });

    socket.on("chatMessage", (data) => {
      setMessages((previous) => [
        ...previous, 
        {
          ...data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (event) => {
    if (event) event.preventDefault();
    if (!username.trim() || !message.trim()) return;

    const socketMessage = {
      username: username.trim(),
      message: message.trim()
    };

    if (socketRef.current) {
      socketRef.current.emit("chatMessage", socketMessage);
    }
    setMessage("");
  };

  const sendQuickPrompt = (promptText) => {
    if (!username.trim()) return;
    const socketMessage = {
      username: username.trim(),
      message: promptText
    };
    if (socketRef.current) {
      socketRef.current.emit("chatMessage", socketMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-slide-up">
      {/* Top Banner / Stream Info */}
      <div className="nexus-glass rounded-2xl p-6 sm:p-8 mb-6 border border-slate-800/80 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-10"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Real-Time Collaboration Hub
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  #general
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Bi-directional, low-latency messaging powered by WebSockets (Socket.IO)
              </p>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              connected 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{connected ? "WebSocket Connected" : "Connecting..."}</span>
              {socketId && (
                <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                  [{socketId.slice(0, 5)}]
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Identity & Display Name Strip */}
        <div className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
              {username.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Your Display Name
              </span>
              <input
                type="text"
                placeholder="Enter your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:text-indigo-400 transition"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>Broadcasts live to all connected browser windows</span>
          </div>
        </div>

        {/* Chat Messages Stream Window */}
        <div className="mt-6 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 sm:p-6 min-h-[360px] max-h-[460px] overflow-y-auto flex flex-col gap-3 shadow-inner">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center m-auto text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                💬
              </div>
              <h2 className="text-sm font-bold text-slate-200">No messages in channel yet</h2>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Be the first to post! Open another tab to test instant bi-directional synchronization.
              </p>
            </div>
          ) : (
            messages.map((item, index) => {
              const isSelf = item.username === username.trim();
              const isBot = item.username === "NexusBot";

              if (isBot) {
                return (
                  <div key={index} className="flex justify-center my-1 animate-slide-up">
                    <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-indigo-300 flex items-center gap-2">
                      <span className="text-xs">🤖</span>
                      <span>{item.message}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={index} 
                  className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} animate-slide-up`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className={`text-[11px] font-bold ${isSelf ? 'text-indigo-400' : 'text-slate-300'}`}>
                      {isSelf ? "You" : item.username}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.timestamp || "Just now"}
                    </span>
                  </div>

                  <div className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                    isSelf 
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-indigo-500/15' 
                      : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                  }`}>
                    {item.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Chips */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Quick Actions:</span>
          {[
            "🚀 Ready to deploy!",
            "✅ Task verified & complete",
            "🔥 Found a bug in backend",
            "👋 Hello from another tab!"
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendQuickPrompt(chip)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700/80 hover:border-indigo-500/40 text-[11px] font-medium transition duration-150"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Dock */}
        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type your message... (Press Enter to send)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Send</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

      </div>
    </div>
  );
}
