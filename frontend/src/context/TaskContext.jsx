import { createContext, useState } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Design responsive frontend pages", 
      status: "TO DO",
      addedBy: "System",
      addedOn: "01/09/2026"
    },
    { 
      id: 2, 
      title: "Setup Tailwind CSS architecture", 
      status: "IN PROGRESS",
      addedBy: "System",
      addedOn: "02/09/2026"
    },
    { 
      id: 3, 
      title: "Initialize Vite environment", 
      status: "COMPLETED", 
      completedBy: "Krishna",
      addedBy: "Krishna",
      addedOn: "05/09/2026"
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");

  // NEW: Accept userName and generate the current date
  const addTask = (taskTitle, userName) => {
    const newTask = { 
      id: Date.now(), 
      title: taskTitle, 
      status: "TO DO",
      addedBy: userName || "Unknown",
      addedOn: new Date().toLocaleDateString('en-GB') // Formats as DD/MM/YYYY
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completeTask = (id, userName) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: "COMPLETED", completedBy: userName } : task
    ));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask, completeTask, searchQuery, setSearchQuery }}>
      {children}
    </TaskContext.Provider>
  );
}