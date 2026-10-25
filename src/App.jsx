import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Navbar from './components/Navbar';
import { UserContext } from './context/UserContext';
import { TaskProvider } from './context/TaskContext';

function DockerHome() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Backend connection failed"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-slate-200/80 shadow-xl max-w-lg w-full">
        {/* Docker Icon Badge */}
        <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 2.714h2.118a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.118a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m0-2.714h2.118a.185.185 0 00.185-.186V6.29a.185.185 0 00-.185-.185h-2.118a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m-2.955 5.428h2.119a.186.186 0 00.185-.185V11.72a.186.186 0 00-.185-.186H5.144a.185.185 0 00-.185.186v1.888c0 .102.083.185.185.185m0-2.714h2.119a.186.186 0 00.185-.185V9.006a.186.186 0 00-.185-.186H5.144a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m0-2.714h2.119a.186.186 0 00.185-.186V6.29a.186.186 0 00-.185-.185H5.144a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.93 5.428h2.118a.185.185 0 00.186-.185V11.72a.186.186 0 00-.186-.186H2.214a.186.186 0 00-.186.186v1.888c0 .102.084.185.186.185m19.742-1.708c-.463-.339-1.29-.444-2.148-.27-.24-1.223-.974-1.854-1.92-1.854-.427 0-.84.135-1.214.394-.28-.535-.765-.894-1.353-.993l-.261-.044-.067.256c-.23.882-.047 1.77.498 2.378-.34.19-.748.293-1.189.293H1.365a.86.86 0 00-.86.859c0 1.947.534 3.753 1.545 5.223 1.488 2.164 3.847 3.535 6.471 3.763 3.655.318 7.37-.899 9.94-3.255 2.197-2.013 3.39-4.82 3.273-7.7-.023-.277-.164-.543-.45-.736z"/>
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">
          Full Stack Docker Application
        </h1>
        <p className="text-sm font-medium text-slate-500 mb-6">Frontend: React</p>

        <div className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
          message.includes("inside Docker")
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : message.includes("failed")
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : "bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse"
        }`}>
          Backend Response: {message}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-semibold">
          <Link to="/kanban" className="text-indigo-600 hover:text-indigo-800 transition">
            Open Kanban Board &rarr;
          </Link>
          <span className="text-slate-300">|</span>
          <Link to="/analytics" className="text-slate-600 hover:text-slate-800 transition">
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const currentUser = { name: 'Krishna', role: 'Lead Developer' };

  return (
    <UserContext.Provider value={currentUser}>
      <TaskProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-50 to-indigo-100 selection:bg-indigo-100">
            <Navbar />
            <Routes>
              {/* Home displays the Exp 7 Docker Verification output */}
              <Route path="/" element={<DockerHome />} />
              <Route path="/kanban" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TaskProvider>
    </UserContext.Provider>
  );
}