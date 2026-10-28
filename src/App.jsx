import React, { Component, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import Projects from './components/Projects';
import Analytics from './components/Analytics';
import Chat from './components/Chat';
import DockerStatus from './components/DockerStatus';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import TaskModal from './components/TaskModal';
import { UserContext } from './context/UserContext';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Resilient Error Boundary to guarantee zero white/blank screens
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem("nexus_tasks_v2");
    } catch {
      // Ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="p-8 rounded-2xl max-w-md w-full text-center border border-rose-500/30 bg-slate-900/95 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center text-2xl mb-4 border border-rose-500/20">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white mb-2">View Render Issue</h2>
            <p className="text-xs text-slate-400 mb-4">
              A temporary render error was safely caught by the Error Boundary.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl text-left font-mono text-[11px] text-rose-300 break-all mb-6 border border-slate-800">
              {this.state.error?.message || "Unknown error"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
              >
                Retry View
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition shadow-lg shadow-indigo-600/30"
              >
                Reset & Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative transition-colors duration-300 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Radiant Ambient Background Mesh */}
      <div className="ambient-glow">
        <div className="ambient-orb-1"></div>
        <div className="ambient-orb-2"></div>
        <div className="ambient-orb-3"></div>
      </div>

      {/* Persistent / Collapsible Left Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Viewport with Desktop Sidebar Offset */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10 transition-all duration-300">
        {/* Universal Top Header */}
        <TopHeader onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/docker" element={<DockerStatus />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>

      {/* Universal Task Creation Modal */}
      <TaskModal />
    </div>
  );
}

export default function App() {
  const currentUser = { name: 'Krishna Gavali', role: 'Lead Full-Stack Developer' };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UserContext.Provider value={currentUser}>
          <TaskProvider>
            <BrowserRouter>
              <MainLayout />
            </BrowserRouter>
          </TaskProvider>
        </UserContext.Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}