import { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

const DEFAULT_TASKS = [
  { 
    id: 1, 
    title: "Design responsive frontend pages & dark mode theme", 
    status: "COMPLETED",
    priority: "High",
    addedBy: "System",
    addedOn: "01/09/2026",
    completedBy: "Krishna"
  },
  { 
    id: 2, 
    title: "Implement real-time WebSocket communication", 
    status: "COMPLETED",
    priority: "High",
    addedBy: "System",
    addedOn: "02/09/2026",
    completedBy: "Krishna"
  },
  { 
    id: 3, 
    title: "Containerize multi-service app with Docker Compose", 
    status: "COMPLETED", 
    priority: "Medium",
    completedBy: "Krishna",
    addedBy: "Krishna",
    addedOn: "05/09/2026"
  },
  { 
    id: 4, 
    title: "Optimize JWT Authentication & Role-Based Access Control", 
    status: "IN PROGRESS", 
    priority: "High",
    addedBy: "Krishna",
    addedOn: "12/09/2026"
  },
  { 
    id: 5, 
    title: "Integrate team presence & collaborative whiteboard", 
    status: "TO DO", 
    priority: "Normal",
    addedBy: "System",
    addedOn: "15/09/2026"
  }
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem("nexus_tasks");
      return stored ? JSON.parse(stored) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("nexus_tasks", JSON.stringify(tasks));
    } catch {
      // Ignore storage errors
    }
  }, [tasks]);

  const addTask = (taskTitle, userName, priority = "Medium") => {
    if (!taskTitle || !taskTitle.trim()) return;
    const newTask = { 
      id: Date.now(), 
      title: taskTitle.trim(), 
      status: "TO DO",
      priority: priority || "Medium",
      addedBy: userName || "Krishna",
      addedOn: new Date().toLocaleDateString('en-GB') // DD/MM/YYYY
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const removeTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const completeTask = (id, userName) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: "COMPLETED", completedBy: userName || "Krishna" } : task
    ));
  };

  const updateTaskStatus = (id, newStatus, userName) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: newStatus,
          ...(newStatus === "COMPLETED" ? { completedBy: userName || task.completedBy || "Krishna" } : {})
        };
      }
      return task;
    }));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      removeTask, 
      completeTask, 
      updateTaskStatus,
      searchQuery, 
      setSearchQuery 
    }}>
      {children}
    </TaskContext.Provider>
  );
}