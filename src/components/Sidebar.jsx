import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';

export default function Sidebar({ isOpen, onClose }) {
  const { tasks, projects, setIsTaskModalOpen } = useContext(TaskContext);
  const user = useContext(UserContext);
  const location = useLocation();

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const todoCount = safeTasks.filter(t => t.status === 'TO DO').length;
  const inProgressCount = safeTasks.filter(t => t.status === 'IN PROGRESS').length;

  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      badge: null,
    },
    {
      to: '/kanban',
      label: 'Kanban Board',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      badge: inProgressCount + todoCount > 0 ? inProgressCount + todoCount : null,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
    },
    {
      to: '/projects',
      label: 'Projects',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badge: projects?.length || 3,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
    },
    {
      to: '/chat',
      label: 'Team Chat',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Clean Light-Mode Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
              KB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">KoBo</h1>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Workspace
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Sprint 24 · Active</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick New Task Button */}
        <div className="p-3">
          <button
            onClick={() => {
              setIsTaskModalOpen(true);
              if (onClose) onClose();
            }}
            className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99]"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Task</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => { if (onClose) onClose(); }}
                className={({ isActive: active }) => `flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  active 
                    ? 'bg-slate-100 text-slate-900 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Active Projects List */}
          <div className="pt-5 px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Active Projects
          </div>
          <div className="space-y-0.5">
            {projects && projects.map(proj => (
              <NavLink
                to="/projects"
                key={proj.id}
                onClick={() => { if (onClose) onClose(); }}
                className="px-2.5 py-1.5 rounded-lg text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span className="truncate">{proj.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{proj.progress}%</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-semibold text-xs">
                KG
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {user?.name || "Krishna Gavali"}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {user?.role || "Developer"}
                </div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500" title="Online"></div>
          </div>
        </div>
      </aside>
    </>
  );
}
