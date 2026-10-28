import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DockerStatus() {
  const [message, setMessage] = useState("Checking backend container connection...");
  const [status, setStatus] = useState("loading");
  const [latency, setLatency] = useState(null);
  const [details, setDetails] = useState(null);

  const checkHealth = () => {
    setStatus("loading");
    const startTime = Date.now();

    fetch("http://localhost:5000/api")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const duration = Math.max(1, Date.now() - startTime);
        setMessage(data?.message || "Backend responded successfully");
        setDetails(data);
        setLatency(duration);
        setStatus("online");
      })
      .catch((err) => {
        setMessage(`Connection error: ${err.message || 'Failed to fetch'}`);
        setStatus("offline");
        setLatency(null);
        setDetails(null);
      });
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[82vh] px-4 py-12 animate-slide-up">
      <div className="nexus-glass p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl max-w-xl w-full relative overflow-hidden">
        {/* Ambient Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-[1.5px] shadow-lg shadow-cyan-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
              🐳
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Docker Topology Status
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Compose v2
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Experiment 9 Multi-Container Microservices Verification
            </p>
          </div>
        </div>

        {/* Services Status Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Frontend Service */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Frontend</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <span className="text-sm font-bold text-white">Vite / React</span>
            <span className="text-[11px] font-mono text-indigo-400">port 5173 (host)</span>
          </div>

          {/* Backend Service */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Backend</span>
              <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            </div>
            <span className="text-sm font-bold text-white">Node / Express</span>
            <span className="text-[11px] font-mono text-cyan-400">port 5000 (host)</span>
          </div>
        </div>

        {/* Live Ping Response Box */}
        <div className={`p-4 rounded-xl border text-xs font-mono transition-all duration-200 mb-6 ${
          status === 'online'
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : status === 'loading'
            ? 'bg-slate-900/60 border-slate-700/80 text-slate-400'
            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center justify-between mb-1.5 font-sans font-bold">
            <span className="flex items-center gap-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-400' : status === 'loading' ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
              HTTP GET http://localhost:5000/api
            </span>
            {latency !== null && (
              <span className="text-[10px] text-slate-400 font-mono">
                {latency} ms latency
              </span>
            )}
          </div>
          <div className="break-all font-mono text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 text-slate-300">
            {status === 'loading' ? 'Pinging endpoint...' : JSON.stringify(details || { message }, null, 2)}
          </div>
        </div>

        {/* Re-check Button */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={checkHealth}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/80 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>Re-Ping Container API</span>
          </button>
        </div>

        {/* Bottom Quick Links */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 text-xs font-semibold">
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1">
            <span>💬 Live Chat</span>
            <span>&rarr;</span>
          </Link>
          <span className="text-slate-700">•</span>
          <Link to="/kanban" className="text-slate-400 hover:text-slate-200 transition">
            Kanban Board
          </Link>
          <span className="text-slate-700">•</span>
          <Link to="/analytics" className="text-slate-400 hover:text-slate-200 transition">
            Analytics
          </Link>
        </div>

      </div>
    </div>
  );
}
