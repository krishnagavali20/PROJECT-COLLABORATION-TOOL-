import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';

export default function KanbanBoard() {
  const { tasks, removeTask, updateTaskStatus, searchQuery, activeFilter, setActiveFilter, setIsTaskModalOpen } = useContext(TaskContext);
  const user = useContext(UserContext);

  const [filterPriority, setFilterPriority] = useState('ALL');

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Filter tasks based on search query, activeFilter, and priority filter
  const filteredTasks = safeTasks.filter(task => {
    const matchesSearch = 
      (task.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (task.description || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (task.category || '').toLowerCase().includes((searchQuery || '').toLowerCase());

    const matchesStatus = 
      activeFilter === 'ALL' || 
      task.status === activeFilter;

    const matchesPriority = 
      filterPriority === 'ALL' || 
      (task.priority || '').toUpperCase() === filterPriority.toUpperCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const columns = [
    {
      id: 'TO DO',
      title: 'To Do',
      color: 'border-slate-700 bg-slate-900/40 text-slate-400',
      badge: 'bg-slate-800 text-slate-300 border-slate-700',
      accentDot: 'bg-slate-400',
      nextStatus: 'IN PROGRESS',
      nextLabel: 'Start ⚡'
    },
    {
      id: 'IN PROGRESS',
      title: 'In Progress',
      color: 'border-amber-500/30 bg-amber-950/10 text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      accentDot: 'bg-amber-400',
      nextStatus: 'IN REVIEW',
      nextLabel: 'Review 🔍'
    },
    {
      id: 'IN REVIEW',
      title: 'In Review',
      color: 'border-purple-500/30 bg-purple-950/10 text-purple-400',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      accentDot: 'bg-purple-400',
      nextStatus: 'COMPLETED',
      nextLabel: 'Complete ✅'
    },
    {
      id: 'COMPLETED',
      title: 'Completed',
      color: 'border-emerald-500/30 bg-emerald-950/10 text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      accentDot: 'bg-emerald-400',
      nextStatus: null,
      nextLabel: null
    }
  ];

  const getPriorityBadge = (priority) => {
    switch ((priority || '').toUpperCase()) {
      case 'URGENT':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-sm shadow-rose-500/10';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'KG';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto animate-slide-up">
      {/* Board Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Sprint Kanban Board</h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Sprint 24
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time multi-column task pipeline with priority routing and instant stage transitions.
          </p>
        </div>

        {/* Priority Filter Chips & Add Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 text-xs">
            {['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  filterPriority === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Add Task</span>
          </button>
        </div>
      </div>

      {/* 4-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div 
              key={col.id}
              className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 shadow-xl flex flex-col min-h-[580px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.accentDot}`}></span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {col.title}
                  </h2>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${col.badge}`}>
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition text-xs"
                  title={`Add task to ${col.title}`}
                >
                  +
                </button>
              </div>

              {/* Task Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="h-44 border-2 border-dashed border-slate-800/60 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-2xl mb-1 opacity-40">📭</span>
                    <p className="text-xs text-slate-500 font-medium">No tasks in {col.title}</p>
                    <button
                      onClick={() => setIsTaskModalOpen(true)}
                      className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
                    >
                      + Create one
                    </button>
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.id}
                      className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                    >
                      {/* Top Tag Row */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                          {task.priority || 'Normal'}
                        </span>

                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                          {task.category || 'General'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 mb-1.5">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                          {task.description}
                        </p>
                      )}

                      {/* Assignee & Date Footer */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-[9px] font-bold">
                            {getInitials(task.addedBy || 'Krishna')}
                          </div>
                          <span className="text-slate-400 truncate max-w-[90px]">
                            {task.addedBy || 'Krishna'}
                          </span>
                        </div>

                        {task.addedOn && (
                          <span className="text-[10px] font-mono text-slate-500">
                            {task.addedOn}
                          </span>
                        )}
                      </div>

                      {/* Card Action Bar */}
                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Quick Move Next Action */}
                        {col.nextStatus && (
                          <button
                            onClick={() => updateTaskStatus(task.id, col.nextStatus, user?.name || 'Krishna')}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold transition flex items-center gap-1"
                          >
                            <span>{col.nextLabel}</span>
                          </button>
                        )}

                        {col.id === 'COMPLETED' && (
                          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                            ✓ Verified Done
                          </span>
                        )}

                        {/* Move Back Button if not in TO DO */}
                        {col.id !== 'TO DO' && (
                          <button
                            onClick={() => {
                              const prev = col.id === 'COMPLETED' ? 'IN REVIEW' : col.id === 'IN REVIEW' ? 'IN PROGRESS' : 'TO DO';
                              updateTaskStatus(task.id, prev, user?.name || 'Krishna');
                            }}
                            className="p-1 rounded text-slate-500 hover:text-slate-300 text-xs"
                            title="Move back"
                          >
                            ←
                          </button>
                        )}

                        {/* Delete Action */}
                        <button
                          onClick={() => removeTask(task.id)}
                          className="p-1 rounded text-slate-600 hover:text-rose-400 transition text-xs"
                          title="Delete Task"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
