import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

export default function Analytics() {
  const { tasks } = useContext(TaskContext);

  // Filter tasks based on their current status
  const todoCount = tasks.filter(task => task.status === 'TO DO').length;
  const inProgressCount = tasks.filter(task => task.status === 'IN PROGRESS').length;
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED');

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Project Analytics</h1>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase">Total Tasks</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{tasks.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase">To Do</p>
          <p className="text-4xl font-bold text-slate-700 mt-2">{todoCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase">In Progress</p>
          <p className="text-4xl font-bold text-amber-500 mt-2">{inProgressCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase">Completed</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">{completedTasks.length}</p>
        </div>
      </div>

      {/* Completed Tasks Audit Log */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Completed Tasks Log
        </h2>
        
        {completedTasks.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No tasks have been completed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                  <th className="py-3 font-semibold w-2/3">Task Description</th>
                  <th className="py-3 font-semibold">Completed By</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map(task => (
                  <tr key={task.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                    <td className="py-3 text-sm font-medium text-slate-700 line-through decoration-slate-300">
                      {task.title}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {/* Dynamic Avatar based on the user's name */}
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                          {task.completedBy?.slice(0, 2).toUpperCase() || 'US'}
                        </div>
                        <span className="text-sm font-medium text-slate-600">{task.completedBy || 'Unknown User'}</span>
                      </div>
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