import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';

export default function Projects() {
  const { projects, tasks, setIsTaskModalOpen } = useContext(TaskContext);

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const completedTasks = safeTasks.filter(t => t.status === 'COMPLETED').length;
  const totalTasks = safeTasks.length || 1;
  const overallRate = Math.round((completedTasks / totalTasks) * 100);

  const milestones = [
    {
      title: "Exp 1-4: Foundation & RESTful CRUD Engine",
      date: "Completed · 21 Oct 2026",
      status: "Verified",
      desc: "MongoDB Atlas cluster integration, Express routing, and dynamic data binding.",
      color: "emerald"
    },
    {
      title: "Exp 5-6: JWT Auth, RBAC & Security Harden",
      date: "Completed · 22 Oct 2026",
      status: "Verified",
      desc: "Helmet header protection, bcrypt salt hashing, and Bearer token role validation.",
      color: "emerald"
    },
    {
      title: "Exp 7: Docker Compose Multi-Container Mesh",
      date: "Completed · 25 Oct 2026",
      status: "Verified",
      desc: "Alpine containerization for Vite on 5173, Express on 5000, and Mongo replica sets.",
      color: "emerald"
    },
    {
      title: "Exp 8-9: WebSockets & Performance Analytics",
      date: "Completed · 26 Oct 2026",
      status: "Verified",
      desc: "Bi-directional real-time chat, latency monitoring, and sprint velocity reporting.",
      color: "cyan"
    },
    {
      title: "Sprint 24: Obsidian Workspace Transformation",
      date: "Active Sprint · 28 Oct 2026",
      status: "In Progress",
      desc: "Cyberpunk high-contrast dark theme, multi-column Kanban board, and executive dashboard.",
      color: "indigo"
    }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto animate-slide-up space-y-8">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Project Roadmaps & Sprints</h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Sprint 24
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Track multi-service milestone progress, sprint deadlines, and deliverables.
          </p>
        </div>

        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition-all duration-200"
        >
          <span>+ Add Sprint Milestone</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Total Sprints</div>
          <div className="text-2xl font-black text-white">{safeProjects.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span>●</span> All on Schedule
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Overall Velocity</div>
          <div className="text-2xl font-black text-indigo-400">{overallRate}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${overallRate}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Active Deliverables</div>
          <div className="text-2xl font-black text-amber-400">{safeTasks.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">{completedTasks} completed</div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Health Status</div>
          <div className="text-2xl font-black text-emerald-400">99.8%</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">Docker Containers Healthy</div>
        </div>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <span>Active Workspaces</span>
          <span className="text-[11px] text-slate-500 font-mono">({safeProjects.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeProjects.map((proj) => {
            const colorClasses = 
              proj.color === 'indigo'
                ? { ring: 'border-indigo-500/30', bar: 'bg-indigo-500', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' }
                : proj.color === 'cyan'
                ? { ring: 'border-cyan-500/30', bar: 'bg-cyan-500', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' }
                : { ring: 'border-emerald-500/30', bar: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };

            return (
              <div 
                key={proj.id}
                className={`bg-slate-900/80 hover:bg-slate-900 border ${colorClasses.ring} p-6 rounded-2xl shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClasses.badge}`}>
                      {proj.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      📅 {proj.dueDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{proj.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div>
                  {/* Progress Meter */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Sprint Progress</span>
                      <span className="font-bold text-white">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`${colorClasses.bar} h-full rounded-full transition-all duration-500`} style={{ width: `${proj.progress}%` }}></div>
                    </div>
                  </div>

                  {/* Members & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <div className="flex items-center -space-x-1.5">
                      {proj.members?.map((m, idx) => (
                        <div 
                          key={idx}
                          className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border border-slate-900 text-white font-bold text-[9px] flex items-center justify-center shadow"
                          title={m}
                        >
                          {m.slice(0, 1)}
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/kanban"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
                    >
                      <span>Open Board</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sprint Roadmap Timeline */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-6 flex items-center gap-2">
          <span>Sprint Delivery Timeline (Exps 1 – 9)</span>
        </h2>

        <div className="relative border-l-2 border-slate-800 ml-4 space-y-6">
          {milestones.map((ms, idx) => (
            <div key={idx} className="relative pl-6 group">
              {/* Dot Beacon */}
              <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 ${
                ms.color === 'emerald' ? 'bg-emerald-400' :
                ms.color === 'cyan' ? 'bg-cyan-400' : 'bg-indigo-500 animate-pulse'
              }`} />

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-md group-hover:border-slate-700 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {ms.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {ms.date}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {ms.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
