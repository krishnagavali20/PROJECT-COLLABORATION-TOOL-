import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Navbar from './components/navbar';
import Chat from './components/Chat';
import { UserContext } from './context/UserContext';
import { TaskProvider } from './context/TaskContext';
import './App.css';

// Experiment 7 Docker Verification Component
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
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">
          Full Stack Docker Application
        </h1>
        <p className="text-sm font-medium text-slate-500 mb-6">Frontend: React</p>

        <div className="py-3 px-4 rounded-xl border text-sm font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
          Backend Response: {message}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-semibold">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition">
            Open Real-Time Chat &rarr;
          </Link>
          <span className="text-slate-300">|</span>
          <Link to="/kanban" className="text-slate-600 hover:text-slate-800 transition">
            Kanban Board
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
              {/* Home displays the Exp 8 WebSocket Real-Time Chat */}
              <Route path="/" element={<Chat />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/docker" element={<DockerHome />} />
              <Route path="/kanban" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TaskProvider>
    </UserContext.Provider>
  );
}