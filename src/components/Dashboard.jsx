import { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';

export default function Dashboard() {
  const { tasks, addTask, removeTask, completeTask, searchQuery } = useContext(TaskContext);
  const user = useContext(UserContext); 
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAdd = () => {
    if (newTaskTitle.trim() !== "") {
      addTask(newTaskTitle, user.name);
      setNewTaskTitle(""); 
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex gap-2">
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task description..."
          className="px-3 py-2 border border-slate-300 rounded text-sm w-64 focus:outline-none focus:border-indigo-500"
        />
        <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition">
          Add Task
        </button>
      </div>

     {/* FINAL FIX: Updated column background and border to match the cool gray theme */}
     <div className="bg-slate-200/50 p-4 rounded-xl border border-slate-300/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] min-h-[300px]">
        <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
          <span>TASKS</span>
          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">{filteredTasks.length}</span>
        </h2>
        
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No tasks found matching "{searchQuery}"</p>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-slate-800 leading-snug w-3/4">{task.title}</p>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => completeTask(task.id, user.name)} 
                      className="text-emerald-600 hover:text-emerald-700 transition text-xs font-bold px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                      title="Mark as Complete"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => removeTask(task.id)} 
                      className="text-red-500 hover:text-red-600 transition text-xs font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded border border-red-200"
                      title="Delete Task"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[8px]">
                      {task.addedBy?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span>Added by <span className="font-semibold text-slate-600">{task.addedBy}</span></span>
                  </div>
                  <span>{task.addedOn}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}