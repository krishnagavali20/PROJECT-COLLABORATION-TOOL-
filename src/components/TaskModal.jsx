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

    setTitle('');
    setDescription('');
    setPriority('High');
    setStatus('TO DO');
    setIsTaskModalOpen(false);
  };

  const priorityOptions = [
    { label: 'Urgent', value: 'Urgent', activeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold' },
    { label: 'High', value: 'High', activeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold' },
    { label: 'Medium', value: 'Medium', activeClass: 'bg-blue-100 text-blue-800 border-blue-300 font-semibold' },
    { label: 'Low', value: 'Low', activeClass: 'bg-slate-200 text-slate-800 border-slate-300 font-semibold' }
  ];

  const categoryOptions = ['Frontend', 'Backend', 'DevOps', 'Security', 'QA', 'General'];
  const statusOptions = ['TO DO', 'IN PROGRESS', 'IN REVIEW', 'COMPLETED'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Light Backdrop */}
      <div 
        onClick={() => setIsTaskModalOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
      />

      {/* Clean White Modal */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl p-6 z-10 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Create Task</h2>
            <p className="text-xs text-slate-500">Add an issue to the current project sprint backlog</p>
          </div>
          <button
            onClick={() => setIsTaskModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement WebSocket rate limiter"
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-600 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add acceptance criteria or notes..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 focus:border-slate-600 focus:ring-1 focus:ring-slate-600 text-xs text-slate-900 placeholder-slate-400 outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 focus:border-slate-600 text-xs text-slate-800 outline-none"
              >
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 focus:border-slate-600 text-xs text-slate-800 outline-none"
              >
                {statusOptions.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority Pill Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOptions.map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setPriority(opt.value)}
                  className={`py-1.5 rounded-lg text-xs border text-center transition ${
                    priority === opt.value
                      ? `${opt.activeClass}`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Assignee</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Assignee name"
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 focus:border-slate-600 text-xs text-slate-900 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition active:scale-[0.99]"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
