import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';

export default function Dashboard() {
  const { tasks, addTask, updateTaskStatus, removeTask, projects, setIsTaskModalOpen } = useContext(TaskContext);
  const user = useContext(UserContext);

  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState('High');

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  const completedCount = safeTasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressCount = safeTasks.filter(t => t.status === 'IN PROGRESS').length;
  const todoCount = safeTasks.filter(t => t.status === 'TO DO').length;
  const totalCount = safeTasks.length || 1;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask(quickTitle.trim(), user?.name || 'Krishna', quickPriority);
    setQuickTitle('');
  };

  const highPriorityTasks = safeTasks.filter(t => 
    t.status !== 'COMPLETED' && (t.priority === 'High' || t.priority === 'Urgent')
  );

  const getPriorityBadge = (priority) => {
    switch ((priority || '').toUpperCase()) {
      case 'URGENT':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto animate-slide-up space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-purple-950/40 border border-indigo-500/30 p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sprint 24 · Production Phase
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">{user?.name || "Krishna"}</span> 👋
            </h1>
            <p className="text-xs lg:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Workspace velocity is active at <strong className="text-indigo-300 font-semibold">{completionPercentage}% sprint completion</strong>. Multi-container microservices and WebSockets are live on Node.js port 5000.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all duration-200 hover:scale-[1.02]"
            >
              + Create Task
            </button>
            <Link
              to="/kanban"
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 font-semibold text-xs border border-slate-700 transition"
            >
              Open Kanban Board →
            </Link>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Backlog</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs">📋</span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white">{safeTasks.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {todoCount} pending · {inProgressCount} active
          </div>
        </div>

        {/* In Progress Velocity */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Velocity</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs">⚡</span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-amber-400">{inProgressCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Tasks in active development
          </div>
        </div>

        {/* Sprint Completion Rate */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sprint Progress</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs">📈</span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-emerald-400">{completionPercentage}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>

        {/* Services & Containers */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Docker Services</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs">🐳</span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-cyan-400">2 / 2 Up</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Frontend & Backend Healthy
          </div>
        </div>
      </div>

      {/* Quick Task Composer Bar */}
      <form onSubmit={handleQuickAdd} className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-2xl shadow-lg flex items-center gap-2">
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="⚡ Quick Add Task: Type task name and press Enter..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
        />
        <select
          value={quickPriority}
          onChange={(e) => setQuickPriority(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
        >
          <option value="Urgent">🔥 Urgent</option>
          <option value="High">⚡ High</option>
          <option value="Medium">📌 Medium</option>
          <option value="Low">☕ Low</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
        >
          Add
        </button>
      </form>

      {/* Main Two-Column Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): High Priority Sprint Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Priority Sprint Queue
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {highPriorityTasks.length} Urgent / High
              </span>
            </div>

            <Link to="/kanban" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              View all tasks →
            </Link>
          </div>

          <div className="space-y-3">
            {highPriorityTasks.length === 0 ? (
              <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
                <p className="text-xs text-slate-400 font-medium">All high priority tasks are completed! 🎉</p>
              </div>
            ) : (
              highPriorityTasks.slice(0, 5).map(task => (
                <div
                  key={task.id}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 p-4 rounded-xl shadow-md transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{task.category || 'Sprint'}</span>
                      <span className="text-[10px] font-mono text-slate-500">· {task.status}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-200 truncate">{task.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {task.status === 'TO DO' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'IN PROGRESS', user?.name || 'Krishna')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[11px] font-semibold transition"
                      >
                        ⚡ Start
                      </button>
                    )}
                    {task.status === 'IN PROGRESS' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'COMPLETED', user?.name || 'Krishna')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold transition"
                      >
                        ✓ Done
                      </button>
                    )}
                    <button
                      onClick={() => removeTask(task.id)}
                      className="p-1 text-slate-600 hover:text-rose-400 transition text-xs"
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

        {/* Right (1 Col): Active Sprints & System Health */}
        <div className="space-y-6">
          {/* Active Sprint Projects Card */}
          <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">Active Workspaces</h2>
              <Link to="/projects" className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium">Details →</Link>
            </div>

            <div className="space-y-3">
              {safeProjects.map(proj => (
                <div key={proj.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-200 truncate">{proj.title}</span>
                    <span className="text-indigo-400 font-mono font-bold">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Real-Time Team Activity Log */}
          <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">Recent Sprint Activity</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  <strong className="text-slate-200 font-semibold">Krishna</strong> completed task <span className="text-indigo-300">"Docker status & analytics resilience"</span>
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  <strong className="text-slate-200 font-semibold">System</strong> connected to <span className="text-cyan-300">Socket.IO real-time channel</span>
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  <strong className="text-slate-200 font-semibold">Sprint 24</strong> reached <span className="text-emerald-400 font-mono">85% velocity milestone</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}