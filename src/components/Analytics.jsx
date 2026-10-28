import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

export default function Analytics() {
  const context = useContext(TaskContext);
  const tasks = Array.isArray(context?.tasks) ? context.tasks : [];

  const total = tasks.length;
  const todoCount = tasks.filter(task => (task?.status || '').toUpperCase() === 'TO DO').length;
  const inProgressCount = tasks.filter(task => (task?.status || '').toUpperCase() === 'IN PROGRESS').length;
  const inReviewCount = tasks.filter(task => (task?.status || '').toUpperCase() === 'IN REVIEW').length;
  const completedTasks = tasks.filter(task => (task?.status || '').toUpperCase() === 'COMPLETED');
  const completedCount = completedTasks.length;

  const completionPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const inProgressPercentage = total > 0 ? Math.round((inProgressCount / total) * 100) : 0;
  const todoPercentage = total > 0 ? Math.round((todoCount / total) * 100) : 0;

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'KG';
    const trimmed = name.trim();
    if (!trimmed) return 'KR';
    const parts = trimmed.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return trimmed.slice(0, 2).toUpperCase();
  };

  return (
    <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 animate-fade-in space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Analytics & Sprint Velocity
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time pipeline breakdown, team velocity, and task completion metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Live Metrics</span>
        </div>
      </div>
      
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Tasks */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">Total Tasks</span>
          <p className="text-2xl font-bold text-slate-900">{total}</p>
          <div className="mt-1 text-[11px] text-slate-500">
            Sprint backlog items
          </div>
        </div>
        
        {/* To Do */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">To Do</span>
          <p className="text-2xl font-bold text-slate-900">{todoCount}</p>
          <div className="mt-1 text-[11px] text-slate-500">
            {todoPercentage}% awaiting start
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">In Progress</span>
          <p className="text-2xl font-bold text-amber-600">{inProgressCount + inReviewCount}</p>
          <div className="mt-1 text-[11px] text-slate-500">
            {inProgressPercentage}% active development
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">Completion Rate</span>
          <p className="text-2xl font-bold text-emerald-600">{completionPercentage}%</p>
          <div className="mt-1 text-[11px] text-slate-500">
            {completedCount} tasks verified done
          </div>
        </div>
      </div>

      {/* Progress Breakdown Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
          Sprint Pipeline Distribution
        </h2>
        
        {/* Multi-segmented bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden border border-slate-200/50">
          <div 
            style={{ width: `${completionPercentage}%` }} 
            className="bg-emerald-500 transition-all duration-300" 
            title={`Completed: ${completionPercentage}%`}
          />
          <div 
            style={{ width: `${inProgressPercentage}%` }} 
            className="bg-amber-500 transition-all duration-300" 
            title={`In Progress: ${inProgressPercentage}%`}
          />
          <div 
            style={{ width: `${todoPercentage}%` }} 
            className="bg-slate-300 transition-all duration-300" 
            title={`To Do: ${todoPercentage}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Completed ({completedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>In Progress ({inProgressCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span>To Do ({todoCount})</span>
          </div>
        </div>
      </div>

      {/* Completed Tasks Audit Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Task Completion Audit</h2>
            <p className="text-xs text-slate-500">Verified deliverables from current and past sprints</p>
          </div>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {completedCount} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Task Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Completed By</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No completed tasks recorded yet.
                  </td>
                </tr>
              ) : (
                completedTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {task.title}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {task.category || 'Sprint'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        task.priority === 'High' || task.priority === 'Urgent'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {task.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-semibold">
                          {getInitials(task.completedBy || task.addedBy || 'Krishna')}
                        </span>
                        <span>{task.completedBy || task.addedBy || 'Krishna'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}