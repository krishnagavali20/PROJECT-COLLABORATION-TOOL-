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
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-6">
      {/* Human-Crafted Light Welcome Header (no purple gradients) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Sprint 24 · Production Workspace
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name || "Krishna"}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Sprint 24 velocity is at <strong className="text-slate-800 font-semibold">{completionPercentage}% completion</strong>. You have {inProgressCount} active tasks currently in development.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition active:scale-[0.99]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Task</span>
            </button>
            <Link
              to="/kanban"
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs border border-slate-200 transition"
            >
              Open Kanban Board →
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (Clean, no Docker) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-slate-900">{safeTasks.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">{todoCount} pending backlog</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">In Progress</div>
          <div className="text-2xl font-bold text-amber-600">{inProgressCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active in this sprint</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Sprint Completion</div>
          <div className="text-2xl font-bold text-emerald-600">{completionPercentage}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200/50">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Completed Tasks</div>
          <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Verified deliverables</div>
        </div>
      </div>

      {/* Quick Task Composer */}
      <form onSubmit={handleQuickAdd} className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-2xs flex items-center gap-2">
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Quick add: Type task title and press Enter..."
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none"
        />
        <select
          value={quickPriority}
          onChange={(e) => setQuickPriority(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 outline-none"
        >
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition"
        >
          Add
        </button>
      </form>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Priority Sprint Queue */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Priority Tasks ({highPriorityTasks.length})
            </h2>

            <Link to="/kanban" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all tasks →
            </Link>
          </div>

          <div className="space-y-2">
            {highPriorityTasks.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center">
                <p className="text-xs text-slate-500 font-medium">All high priority tasks are completed.</p>
              </div>
            ) : (
              highPriorityTasks.slice(0, 5).map(task => (
                <div
                  key={task.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 p-3.5 rounded-lg shadow-2xs transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-400">{task.category || 'Sprint'}</span>
                      <span className="text-[10px] font-mono text-slate-400">· {task.status}</span>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-800 truncate">{task.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {task.status === 'TO DO' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'IN PROGRESS', user?.name || 'Krishna')}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition"
                      >
                        Start →
                      </button>
                    )}
                    {task.status === 'IN PROGRESS' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'COMPLETED', user?.name || 'Krishna')}
                        className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-medium transition"
                      >
                        ✓ Done
                      </button>
                    )}
                    <button
                      onClick={() => removeTask(task.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition text-xs"
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

        {/* Right: Sprints & Activity */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Workspaces</h2>
              <Link to="/projects" className="text-[11px] text-blue-600 hover:text-blue-700 font-medium">Details →</Link>
            </div>

            <div className="space-y-2.5">
              {safeProjects.map(proj => (
                <div key={proj.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-800 truncate">{proj.title}</span>
                    <span className="text-slate-500 font-mono font-semibold">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recent Activity</h2>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong className="text-slate-800 font-medium">Krishna</strong> completed task <span className="text-slate-700">"Component boundary integrity"</span>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong className="text-slate-800 font-medium">System</strong> connected to <span className="text-slate-700">WebSocket real-time channel</span>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong className="text-slate-800 font-medium">Sprint 24</strong> reached <span className="text-slate-700 font-medium">85% velocity milestone</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}