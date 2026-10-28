import { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';

export default function Dashboard() {
  const { tasks, addTask, removeTask, completeTask, updateTaskStatus, searchQuery } = useContext(TaskContext);
  const user = useContext(UserContext); 
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");

  const handleAdd = (e) => {
    if (e) e.preventDefault();
    if (newTaskTitle.trim() !== "") {
      addTask(newTaskTitle, user?.name || "Krishna", newTaskPriority);
      setNewTaskTitle(""); 
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todoTasks = filteredTasks.filter(t => t.status === 'TO DO');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'IN PROGRESS');
  const completedTasks = filteredTasks.filter(t => t.status === 'COMPLETED');

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const renderTaskCard = (task) => {
    const isDone = task.status === 'COMPLETED';

    return (
      <div 
        key={task.id} 
        className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
      >
        {/* Top Card Row: Priority & Actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
            {task.priority || "Normal"}
          </span>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 opacity-75 group-hover:opacity-100 transition-opacity">
            {task.status === 'TO DO' && (
              <button 
                onClick={() => updateTaskStatus(task.id, 'IN PROGRESS')} 
                className="p-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs transition"
                title="Move to In Progress"
              >
                ⚡ Start
              </button>
            )}

            {task.status !== 'COMPLETED' ? (
              <button 
                onClick={() => completeTask(task.id, user?.name || "Krishna")} 
                className="p-1 px-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition"
                title="Mark as Complete"
              >
                ✓
              </button>
            ) : (
              <button 
                onClick={() => updateTaskStatus(task.id, 'TO DO')} 
                className="p-1 px-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs transition"
                title="Reopen Task"
              >
                ↺
              </button>
            )}

            <button 
              onClick={() => removeTask(task.id)} 
              className="p-1 px-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition"
              title="Delete Task"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Task Title */}
        <p className={`text-sm font-semibold leading-relaxed mb-3 ${
          isDone ? 'line-through text-slate-500 decoration-slate-600' : 'text-slate-100'
        }`}>
          {task.title}
        </p>

        {/* Card Footer: Metadata */}
        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-[9px]">
              {task.addedBy?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span>{task.addedBy || 'System'}</span>
          </div>
          <span>{task.addedOn}</span>
        </div>
      </div>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sprint Kanban Board
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {filteredTasks.length} Active Tasks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time collaborative task pipeline with automated workflow states.
          </p>
        </div>

        {/* New Task Inline Dock */}
        <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2">
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add new task title..."
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-64 shadow-inner"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Normal">Normal</option>
          </select>
          <button 
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            + Add Task
          </button>
        </form>
      </div>

      {/* 3-Column Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMN 1: TO DO */}
        <div className="nexus-glass rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col min-h-[480px]">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-300">
                To Do
              </h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {todoTasks.length}
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {todoTasks.length === 0 ? (
              <div className="h-48 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-4">
                <span className="text-2xl mb-1">📋</span>
                <p className="text-xs text-slate-400 font-medium">No tasks in backlog</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Create a task above to get started</p>
              </div>
            ) : (
              todoTasks.map(renderTaskCard)
            )}
          </div>
        </div>

        {/* COLUMN 2: IN PROGRESS */}
        <div className="nexus-glass rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col min-h-[480px]">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse"></span>
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-300">
                In Progress
              </h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {inProgressTasks.length === 0 ? (
              <div className="h-48 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-4">
                <span className="text-2xl mb-1">⚡</span>
                <p className="text-xs text-slate-400 font-medium">No active tasks</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Click Start on a To Do card</p>
              </div>
            ) : (
              inProgressTasks.map(renderTaskCard)
            )}
          </div>
        </div>

        {/* COLUMN 3: COMPLETED */}
        <div className="nexus-glass rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col min-h-[480px]">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-300">
                Completed
              </h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {completedTasks.length}
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {completedTasks.length === 0 ? (
              <div className="h-48 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-4">
                <span className="text-2xl mb-1">🎯</span>
                <p className="text-xs text-slate-400 font-medium">No completed tasks yet</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Finish in-progress tasks to verify</p>
              </div>
            ) : (
              completedTasks.map(renderTaskCard)
            )}
          </div>
        </div>

      </div>
    </main>
  );
}