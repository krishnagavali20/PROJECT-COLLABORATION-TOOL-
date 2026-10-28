import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

export default function Analytics() {
  const { tasks } = useContext(TaskContext);

  const total = tasks.length;
  const todoCount = tasks.filter(task => task.status === 'TO DO').length;
  const inProgressCount = tasks.filter(task => task.status === 'IN PROGRESS').length;
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED');
  const completedCount = completedTasks.length;

  const completionPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const inProgressPercentage = total > 0 ? Math.round((inProgressCount / total) * 100) : 0;
  const todoPercentage = total > 0 ? Math.round((todoCount / total) * 100) : 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Project Analytics & Velocity
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Metrics
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time pipeline breakdown, team velocity, and task completion metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Updated dynamically across components</span>
        </div>
      </div>
      
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Total Tasks */}
        <div className="nexus-glass nexus-glass-hover rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Tasks</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm">
              📁
            </div>
          </div>
          <p className="text-3xl font-black text-white">{total}</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-indigo-400 font-semibold">100%</span>
            <span>of current sprint roadmap</span>
          </div>
        </div>
        
        {/* To Do */}
        <div className="nexus-glass nexus-glass-hover rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Backlog (To Do)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm">
              📌
            </div>
          </div>
          <p className="text-3xl font-black text-blue-400">{todoCount}</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-blue-400 font-semibold">{todoPercentage}%</span>
            <span>awaiting assignment</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="nexus-glass nexus-glass-hover rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm">
              ⚡
            </div>
          </div>
          <p className="text-3xl font-black text-amber-400">{inProgressCount}</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-amber-400 font-semibold">{inProgressPercentage}%</span>
            <span>active in development</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="nexus-glass nexus-glass-hover rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completion Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm">
              🎯
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400">{completionPercentage}%</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">{completedCount}</span>
            <span>tasks verified & finished</span>
          </div>
        </div>

      </div>

      {/* Visual Task Distribution Progress Bar */}
      <div className="nexus-glass rounded-2xl p-6 border border-slate-800 mb-8">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-200">Roadmap Distribution Breakdown</span>
          <span className="text-slate-400 font-mono">{completedCount}/{total} Complete</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
          <div 
            style={{ width: `${completedPercentage}%` }} 
            className="h-full rounded-l-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
            title={`Completed: ${completedPercentage}%`}
          />
          <div 
            style={{ width: `${inProgressPercentage}%` }} 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500" 
            title={`In Progress: ${inProgressPercentage}%`}
          />
          <div 
            style={{ width: `${todoPercentage}%` }} 
            className="h-full rounded-r-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" 
            title={`To Do: ${todoPercentage}%`}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Completed ({completedPercentage}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>In Progress ({inProgressPercentage}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>To Do ({todoPercentage}%)</span>
          </div>
        </div>
      </div>

      {/* Completed Tasks Audit Log Table */}
      <div className="nexus-glass rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            Completed Tasks Audit Log
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {completedTasks.length} Entries
          </span>
        </div>
        
        {completedTasks.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-3xl mb-2 block">⏳</span>
            <p className="text-sm font-semibold text-slate-300">No completed tasks on record</p>
            <p className="text-xs text-slate-500 mt-1">Mark tasks as complete in the Kanban board to view audit history.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3 font-bold w-1/2">Task Description</th>
                  <th className="py-3 px-3 font-bold">Status</th>
                  <th className="py-3 px-3 font-bold">Completed By</th>
                  <th className="py-3 px-3 font-bold text-right">Audit Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {completedTasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-900/40 transition duration-150">
                    <td className="py-3.5 px-3 text-sm font-medium text-slate-300 flex items-center gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                      <span className="line-through decoration-slate-600 text-slate-400">
                        {task.title}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Verified Done
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center text-[10px] shadow-sm">
                          {task.completedBy?.slice(0, 2).toUpperCase() || 'KR'}
                        </div>
                        <span className="text-xs font-semibold text-slate-300">
                          {task.completedBy || 'Krishna'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right text-xs text-slate-400 font-mono">
                      {task.addedOn || "25/10/2026"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}