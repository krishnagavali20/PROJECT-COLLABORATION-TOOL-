import React, { Component, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import Projects from './components/Projects';
import Analytics from './components/Analytics';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import TaskModal from './components/TaskModal';
import Auth from './components/Auth';
import { UserProvider, UserContext } from './context/UserContext';
import { TaskProvider } from './context/TaskContext';
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
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
          <div className="p-6 rounded-xl max-w-md w-full text-center border border-slate-200 bg-white shadow-lg">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center text-lg mb-3 border border-rose-200">
              ⚠️
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-1">View Render Issue</h2>
            <p className="text-xs text-slate-500 mb-4">
              A temporary render error was safely caught.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg text-left font-mono text-[11px] text-rose-600 break-all mb-5 border border-slate-200">
              {this.state.error?.message || "Unknown error"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
              >
                Retry
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition"
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900">
      {/* Persistent / Collapsible Left Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Viewport with Desktop Sidebar Offset */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-200">
        {/* Universal Top Header */}
        <TopHeader onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 pb-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>

      {/* Universal Task Creation Modal */}
      <TaskModal />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useContext(UserContext);

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <TaskProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TaskProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}