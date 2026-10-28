import { useEffect, useState, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../context/UserContext";

export default function Chat() {
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState(user?.name || "Krishna");

  useEffect(() => {
    if (user?.name) {
      setUsername(user.name);
    }
  }, [user?.name]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      username: "System",
      message: "Team chat connected via WebSockets. Messages synchronize across browser tabs in real-time.",
      timestamp: "System"
    }
  ]);
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const socket = io(backendUrl, {
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
      profession: user?.profession || "Developer",
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
      profession: user?.profession || "Developer",
      message: promptText
    };
    if (socketRef.current) {
      socketRef.current.emit("chatMessage", socketMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-slate-900">
                  KoBo Team Chat
                </h1>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  #general
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Real-time WebSocket communication on port 5000
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              connected 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span>{connected ? "Connected" : "Connecting..."}</span>
              {socketId && (
                <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                  ({socketId.slice(0, 4)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Display Name Setting Bar */}
        <div className="bg-slate-50/70 px-4 sm:px-5 py-2.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Your Name:</span>
            <input
              type="text"
              placeholder="Your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-400"
            />
          </div>
          <span className="text-[11px] text-slate-400">
            Messages sync instantly across all browser windows
          </span>
        </div>

        {/* Message Stream */}
        <div className="p-4 sm:p-6 min-h-[380px] max-h-[460px] overflow-y-auto flex flex-col gap-3 bg-slate-50/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center m-auto text-center py-12 text-slate-400">
              <p className="text-xs font-medium">No messages yet. Send the first message!</p>
            </div>
          ) : (
            messages.map((item, index) => {
              const isSelf = item.username === username.trim();
              const isSystem = item.username === "System";

              if (isSystem) {
                return (
                  <div key={index} className="flex justify-center my-1">
                    <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
                      {item.message}
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={index} 
                  className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                    <span className="font-semibold text-slate-700">
                      {isSelf ? "You" : item.username}
                    </span>
                    {item.profession && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded font-sans">
                        {item.profession}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {item.timestamp || "Just now"}
                    </span>
                  </div>

                  <div className={`max-w-[85%] sm:max-w-md px-3.5 py-2 rounded-lg text-xs leading-relaxed ${
                    isSelf 
                      ? 'bg-slate-900 text-white rounded-tr-none shadow-2xs' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                  }`}>
                    {item.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips */}
        <div className="px-4 sm:px-5 py-2.5 bg-white border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 mr-1">Quick text:</span>
          {[
            "Sprint review scheduled for 4 PM",
            "Task verified & moved to completed",
            "Bug identified on backend endpoint",
            "All test suites passing"
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendQuickPrompt(chip)}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-[11px] font-medium transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Dock */}
        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder="Type your message... (press Enter to send)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-500 transition"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs transition active:scale-[0.99]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
