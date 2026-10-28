import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';

export default function TaskModal() {
  const { isTaskModalOpen, setIsTaskModalOpen, addTask } = useContext(TaskContext);
  const user = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High');
  const [status, setStatus] = useState('TO DO');
  const [category, setCategory] = useState('Frontend');
  const [assignee, setAssignee] = useState(user?.name || 'Krishna');

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isTaskModalOpen) {
        setIsTaskModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, setIsTaskModalOpen]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || 'Sprint item created via task composer',
      status,
      priority,
      category,
      addedBy: assignee.trim() || user?.name || 'Krishna'
    });

    // Reset & close
    setTitle('');
    setDescription('');
    setPriority('High');
    setStatus('TO DO');
    setIsTaskModalOpen(false);
  };

  const priorityOptions = [
    { label: 'Urgent', value: 'Urgent', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    { label: 'High', value: 'High', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { label: 'Medium', value: 'Medium', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
    { label: 'Low', value: 'Low', color: 'bg-slate-700/40 text-slate-300 border-slate-600' }
  ];

  const categoryOptions = ['Frontend', 'Backend', 'DevOps', 'Security', 'QA', 'Design'];
  const statusOptions = ['TO DO', 'IN PROGRESS', 'IN REVIEW', 'COMPLETED'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim Backdrop Blur */}
      <div 
        onClick={() => setIsTaskModalOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-950/50 p-6 z-10 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Create New Task</h2>
              <p className="text-[11px] text-slate-400">Add an issue to the current sprint backlog</p>
            </div>
          </div>
          <button
            onClick={() => setIsTaskModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement WebSocket rate limiter & reconnect backoff"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description / Acceptance Criteria
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe deliverables, technical scope, or dependencies..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs text-white placeholder-slate-500 outline-none transition resize-none"
            />
          </div>

          {/* Category & Status Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 outline-none"
              >
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-slate-200 outline-none"
              >
                {statusOptions.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority Pill Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority Level</label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOptions.map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setPriority(opt.value)}
                  className={`py-2 rounded-xl text-xs font-medium border text-center transition ${
                    priority === opt.value
                      ? `${opt.color} ring-2 ring-indigo-500/30 font-bold scale-[1.02]`
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assigned To</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Assignee name"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs text-white outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Add Task to Sprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
