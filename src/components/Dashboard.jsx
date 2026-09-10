import { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext'; // Import UserContext

export default function Dashboard() {
  const { tasks, addTask, removeTask, searchQuery } = useContext(TaskContext);
  const user = useContext(UserContext); // Grab the user's data
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAdd = () => {
    if (newTaskTitle.trim() !== "") {
      // Pass the user's name when adding the task
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
          className="px-3 py-2 border border-slate-300 rounded text-sm w-64 focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition">
          Add Task
        </button>
      </div>

     <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] min-h-[300px]">
        <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
          <span>TASKS</span>
          <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs">{filteredTasks.length}</span>
        </h2>
        
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No tasks found matching "{searchQuery}"</p>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="bg-white p-3 rounded border border-slate-200 shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-slate-800 leading-snug">{task.title}</p>
                  <button onClick={() => removeTask(task.id)} className="text-slate-400 hover:text-red-500 transition text-xs font-bold p-1">
                    ✕
                  </button>
                </div>
                
                {/* NEW: Audit Trail Footer on the card */}
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