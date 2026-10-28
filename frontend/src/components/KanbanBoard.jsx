import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';

export default function KanbanBoard() {
  const { tasks, removeTask, updateTaskStatus, searchQuery, activeFilter, setIsTaskModalOpen, loadSampleData } = useContext(TaskContext);
  const { user } = useContext(UserContext);

  const [filterPriority, setFilterPriority] = useState('ALL');

  const safeTasks = Array.isArray(tasks) ? tasks : [];

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
      dotColor: 'bg-slate-400',
      nextStatus: 'IN PROGRESS',
      nextLabel: 'Start →'
    },
    {
      id: 'IN PROGRESS',
      title: 'In Progress',
      dotColor: 'bg-amber-500',
      nextStatus: 'IN REVIEW',
      nextLabel: 'Submit for Review →'
    },
    {
      id: 'IN REVIEW',
      title: 'In Review',
      dotColor: 'bg-blue-500',
      nextStatus: 'COMPLETED',
      nextLabel: 'Approve & Done ✓'
    },
    {
      id: 'COMPLETED',
      title: 'Completed',
      dotColor: 'bg-emerald-500',
      nextStatus: null,
      nextLabel: null
    }
  ];

  const getPriorityBadge = (priority) => {
    switch ((priority || '').toUpperCase()) {
      case 'URGENT':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'KG';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in">
      {/* Board Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Kanban Board</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sprint backlog and task workflow pipeline.
          </p>
        </div>

        {/* Priority Filter Chips & Add Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs">
            {['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  filterPriority === p
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition active:scale-[0.99] cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Zero State Alert Banner */}
      {safeTasks.length === 0 && (
        <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
              0
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-800">Your Kanban sprint board has 0 tasks</h4>
              <p className="text-[11px] text-slate-500">Create your first task or click below to load sample sprint data.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadSampleData}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition cursor-pointer"
            >
              ⚡ Load Sample Tasks
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition cursor-pointer"
            >
              + Create Task
            </button>
          </div>
        </div>
      )}

      {/* 4-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div 
              key={col.id}
              className="bg-slate-100/70 border border-slate-200 rounded-xl p-3 flex flex-col min-h-[580px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`}></span>
                  <h2 className="text-xs font-semibold text-slate-800">
                    {col.title}
                  </h2>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition text-xs font-medium"
                  title={`Add task to ${col.title}`}
                >
                  +
                </button>
              </div>

              {/* Task Cards Container */}
              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-3 text-center">
                    <p className="text-xs text-slate-400 font-medium">No tasks</p>
                    <button
                      onClick={() => setIsTaskModalOpen(true)}
                      className="mt-1 text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      + Create task
                    </button>
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 p-3.5 rounded-lg shadow-2xs hover:shadow-xs transition duration-150"
                    >
                      {/* Top Row: Priority & Category */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                          {task.priority || 'Normal'}
                        </span>

                        <span className="text-[10px] font-medium text-slate-500">
                          {task.category || 'General'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xs font-semibold text-slate-900 mb-1 leading-snug">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-2.5 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Assignee & Date */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-semibold">
                            {getInitials(task.addedBy || 'Krishna')}
                          </div>
                          <span className="text-slate-600 truncate max-w-[100px]">
                            {task.addedBy || 'Krishna'}
                          </span>
                        </div>

                        {task.addedOn && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {task.addedOn}
                          </span>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        {col.nextStatus && (
                          <button
                            onClick={() => updateTaskStatus(task.id, col.nextStatus, user?.name || 'Krishna')}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition"
                          >
                            {col.nextLabel}
                          </button>
                        )}

                        {col.id === 'COMPLETED' && (
                          <span className="text-[10px] text-emerald-700 font-medium">
                            ✓ Done
                          </span>
                        )}

                        {/* Move Back */}
                        {col.id !== 'TO DO' && (
                          <button
                            onClick={() => {
                              const prev = col.id === 'COMPLETED' ? 'IN REVIEW' : col.id === 'IN REVIEW' ? 'IN PROGRESS' : 'TO DO';
                              updateTaskStatus(task.id, prev, user?.name || 'Krishna');
                            }}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs"
                            title="Move back"
                          >
                            ←
                          </button>
                        )}

                        {/* Delete Action */}
                        <button
                          onClick={() => removeTask(task.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition text-xs"
                          title="Delete"
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
