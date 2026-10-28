import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { searchQuery, setSearchQuery, tasks } = useContext(TaskContext);
  const user = useContext(UserContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const pendingTasksCount = tasks ? tasks.filter(t => t.status !== 'COMPLETED').length : 0;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/85 dark:bg-slate-950/85 border-b border-slate-800/80 shadow-lg shadow-black/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Main Nav Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  NEXUS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 -mt-0.5 hidden sm:inline">
                Workspace
              </span>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => 
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Chat</span>
            </NavLink>

            <NavLink 
              to="/kanban" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
              <span>Kanban</span>
              {pendingTasksCount > 0 && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-600/40 text-indigo-200 border border-indigo-500/30">
                  {pendingTasksCount}
                </span>
              )}
            </NavLink>

            <NavLink 
              to="/analytics" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
              <span>Analytics</span>
            </NavLink>

            <NavLink 
              to="/docker" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12H2" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                <line x1="6" y1="16" x2="6.01" y2="16" />
                <line x1="10" y1="16" x2="10.01" y2="16" />
              </svg>
              <span>Docker</span>
            </NavLink>
          </nav>
        </div>
        
        {/* Right Section: Search & User Controls */}
        <div className="flex items-center gap-3">
          
          {/* Quick Search */}
          <div className="relative hidden sm:block w-48 md:w-60">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-7 py-2 rounded-lg bg-slate-800/70 border border-slate-700/80 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-amber-400 hover:border-slate-600 transition duration-200"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-amber-400 animate-spin-once" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/20">
                {user?.name?.charAt(0) || 'K'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.name || 'Krishna'}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                {user?.role || 'Lead Developer'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}