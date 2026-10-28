import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

export const TaskContext = createContext();

export const SAMPLE_PROJECTS = [
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

export const SAMPLE_TASKS = [
  { 
    id: 1, 
    title: "Design responsive frontend pages & clean light theme", 
    description: "Create an ultra-sleek workspace layout with human-crafted UI.",
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
  }
];

export function TaskProvider({ children }) {
  const { user } = useContext(UserContext);

  // Derive isolated storage keys per authenticated user
  const userKey = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'guest';
  const tasksStorageKey = `kobo_tasks_${userKey}`;
  const projectsStorageKey = `kobo_projects_${userKey}`;

  // Initialize tasks: Brand new users start with 0 tasks (empty array)
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(tasksStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Initialize projects: Brand new users start with 0 projects (empty array)
  const [projects, setProjects] = useState(() => {
    try {
      const stored = localStorage.getItem(projectsStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Sync tasks when user switches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(tasksStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTasks(Array.isArray(parsed) ? parsed : []);
      } else {
        setTasks([]);
      }
    } catch {
      setTasks([]);
    }
  }, [tasksStorageKey]);

  // Sync projects when user switches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(projectsStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProjects(Array.isArray(parsed) ? parsed : []);
      } else {
        setProjects([]);
      }
    } catch {
      setProjects([]);
    }
  }, [projectsStorageKey]);

  // Persist tasks per user
  useEffect(() => {
    try {
      localStorage.setItem(tasksStorageKey, JSON.stringify(tasks));
    } catch {
      // Ignore storage errors
    }
  }, [tasks, tasksStorageKey]);

  // Persist projects per user
  useEffect(() => {
    try {
      localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
    } catch {
      // Ignore storage errors
    }
  }, [projects, projectsStorageKey]);

  const addTask = (taskInput, userName, priority = "Medium") => {
    let newTask;
    const author = userName || user?.name || "Member";
    if (typeof taskInput === "object" && taskInput !== null) {
      newTask = {
        id: Date.now(),
        title: taskInput.title?.trim() || "New Task",
        description: taskInput.description?.trim() || "No description provided",
        status: (taskInput.status || "TO DO").toUpperCase(),
        priority: taskInput.priority || priority || "Medium",
        addedBy: taskInput.addedBy || author,
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
        addedBy: author,
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
      task.id === id ? { ...task, status: "COMPLETED", completedBy: userName || user?.name || "Member" } : task
    ) : []));
  };

  const updateTaskStatus = (id, newStatus, userName) => {
    setTasks(prev => (Array.isArray(prev) ? prev.map(task => {
      if (task.id === id) {
        const upper = newStatus.toUpperCase();
        return {
          ...task,
          status: upper,
          completedBy: upper === "COMPLETED" ? (userName || user?.name || task.completedBy || "Member") : ""
        };
      }
      return task;
    }) : []));
  };

  const addProject = (projectInput) => {
    const newProj = {
      id: "proj-" + Date.now(),
      title: projectInput.title?.trim() || "New Project",
      description: projectInput.description?.trim() || "Sprint roadmap project",
      status: projectInput.status || "Active Sprint",
      progress: Number(projectInput.progress) || 0,
      dueDate: projectInput.dueDate || "30 Nov 2026",
      members: projectInput.members || [user?.name || "Member"],
      color: projectInput.color || "indigo"
    };
    setProjects(prev => [newProj, ...(Array.isArray(prev) ? prev : [])]);
  };

  const removeProject = (id) => {
    setProjects(prev => (Array.isArray(prev) ? prev.filter(p => p.id !== id) : []));
  };

  // Helper to load sample data if user wants to test or explore
  const loadSampleData = () => {
    setTasks(SAMPLE_TASKS);
    setProjects(SAMPLE_PROJECTS);
  };

  // Helper to reset workspace to 0 items
  const clearAllData = () => {
    setTasks([]);
    setProjects([]);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks: Array.isArray(tasks) ? tasks : [], 
      projects: Array.isArray(projects) ? projects : [],
      addTask, 
      removeTask, 
      completeTask, 
      updateTaskStatus,
      addProject,
      removeProject,
      loadSampleData,
      clearAllData,
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