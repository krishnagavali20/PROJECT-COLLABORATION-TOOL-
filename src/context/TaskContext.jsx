import { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "MERN Real-Time Workspace",
    description: "Core full-stack web application with WebSockets, JWT authentication, and MongoDB.",
    status: "Active Sprint",
    progress: 85,
    dueDate: "30 Oct 2026",
    members: ["Krishna", "System", "Dev"],
    color: "indigo"
  },
  {
    id: "proj-2",
    title: "Docker Microservices Mesh",
    description: "Containerized multi-service architecture using Dockerfiles and Docker Compose.",
    status: "In Review",
    progress: 95,
    dueDate: "28 Oct 2026",
    members: ["Krishna", "DevOps"],
    color: "cyan"
  },
  {
    id: "proj-3",
    title: "Security & Role-Based Access",
    description: "Helmet, bcrypt password hashing, and role authorization middlewares.",
    status: "Completed",
    progress: 100,
    dueDate: "25 Oct 2026",
    members: ["Krishna", "SecOps"],
    color: "emerald"
  }
];

const DEFAULT_TASKS = [
  { 
    id: 1, 
    title: "Design responsive frontend pages & dark mode theme", 
    description: "Create an ultra-sleek workspace layout with glassmorphism and theme toggle.",
    status: "COMPLETED",
    priority: "High",
    addedBy: "System",
    addedOn: "01/09/2026",
    completedBy: "Krishna",
    category: "Frontend"
  },
  { 
    id: 2, 
    title: "Implement real-time WebSocket communication", 
    description: "Bi-directional instant event messaging between clients and Node.js server.",
    status: "COMPLETED",
    priority: "High",
    addedBy: "System",
    addedOn: "02/09/2026",
    completedBy: "Krishna",
    category: "Backend"
  },
  { 
    id: 3, 
    title: "Containerize multi-service app with Docker Compose", 
    description: "Multi-stage Alpine containers for Vite on 5173 and Express on 5000.",
    status: "COMPLETED", 
    priority: "Medium",
    completedBy: "Krishna",
    addedBy: "Krishna",
    addedOn: "05/09/2026",
    category: "DevOps"
  },
  { 
    id: 4, 
    title: "Optimize JWT Authentication & Role-Based Access Control", 
    description: "Ensure tokens are securely verified and endpoints have role restrictions.",
    status: "IN PROGRESS", 
    priority: "High",
    addedBy: "Krishna",
    addedOn: "12/09/2026",
    completedBy: "",
    category: "Security"
  },
  { 
    id: 5, 
    title: "Review code quality & component boundary integrity", 
    description: "Perform end-to-end audit of all interactive UI routes and event handlers.",
    status: "IN REVIEW", 
    priority: "Medium",
    addedBy: "System",
    addedOn: "14/09/2026",
    completedBy: "",
    category: "QA"
  },
  { 
    id: 6, 
    title: "Integrate team presence & collaborative whiteboard", 
    description: "Add live typing indicators and user activity broadcast over Socket.IO.",
    status: "TO DO", 
    priority: "Normal",
    addedBy: "System",
    addedOn: "15/09/2026",
    completedBy: "",
    category: "Features"
  }
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem("nexus_tasks_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t, idx) => ({
            id: t?.id || (Date.now() + idx),
            title: t?.title || "Untitled Task",
            description: t?.description || "No description provided",
            status: (t?.status || "TO DO").toUpperCase(),
            priority: t?.priority || "Normal",
            addedBy: t?.addedBy || "Krishna",
            addedOn: t?.addedOn || "28/10/2026",
            completedBy: t?.completedBy || (t?.status === "COMPLETED" ? (t?.addedBy || "Krishna") : ""),
            category: t?.category || "General"
          }));
        }
      }
      return DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [projects] = useState(DEFAULT_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("nexus_tasks_v2", JSON.stringify(tasks));
    } catch {
      // Ignore storage errors
    }
  }, [tasks]);

  const addTask = (taskInput, userName, priority = "Medium") => {
    let newTask;
    if (typeof taskInput === "object" && taskInput !== null) {
      newTask = {
        id: Date.now(),
        title: taskInput.title?.trim() || "New Task",
        description: taskInput.description?.trim() || "No description provided",
        status: (taskInput.status || "TO DO").toUpperCase(),
        priority: taskInput.priority || priority || "Medium",
        addedBy: taskInput.addedBy || userName || "Krishna",
        addedOn: new Date().toLocaleDateString('en-GB'),
        completedBy: "",
        category: taskInput.category || "General"
      };
    } else {
      if (!taskInput || !taskInput.trim()) return;
      newTask = { 
        id: Date.now(), 
        title: taskInput.trim(), 
        description: "Task created from quick action bar",
        status: "TO DO",
        priority: priority || "Medium",
        addedBy: userName || "Krishna",
        addedOn: new Date().toLocaleDateString('en-GB'),
        completedBy: "",
        category: "General"
      };
    }
    setTasks(prev => [newTask, ...(Array.isArray(prev) ? prev : [])]);
  };

  const removeTask = (id) => {
    setTasks(prev => (Array.isArray(prev) ? prev.filter(task => task.id !== id) : []));
  };

  const completeTask = (id, userName) => {
    setTasks(prev => (Array.isArray(prev) ? prev.map(task => 
      task.id === id ? { ...task, status: "COMPLETED", completedBy: userName || "Krishna" } : task
    ) : []));
  };

  const updateTaskStatus = (id, newStatus, userName) => {
    setTasks(prev => (Array.isArray(prev) ? prev.map(task => {
      if (task.id === id) {
        const upper = newStatus.toUpperCase();
        return {
          ...task,
          status: upper,
          completedBy: upper === "COMPLETED" ? (userName || task.completedBy || "Krishna") : ""
        };
      }
      return task;
    }) : []));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks: Array.isArray(tasks) ? tasks : DEFAULT_TASKS, 
      projects,
      addTask, 
      removeTask, 
      completeTask, 
      updateTaskStatus,
      searchQuery, 
      setSearchQuery,
      activeFilter,
      setActiveFilter,
      isTaskModalOpen,
      setIsTaskModalOpen
    }}>
      {children}
    </TaskContext.Provider>
  );
}