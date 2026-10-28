import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';

export default function Projects() {
  const { projects, tasks, addProject, removeProject, loadSampleData } = useContext(TaskContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('30 Nov 2026');
  const [progress, setProgress] = useState(0);

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const completedTasks = safeTasks.filter(t => t.status === 'COMPLETED').length;
  const totalTasks = safeTasks.length || 0;
  const overallRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addProject({
      title: title.trim(),
      description: description.trim() || 'Sprint roadmap milestone project',
      dueDate,
      progress: Number(progress) || 0,
      status: Number(progress) === 100 ? 'Completed' : 'Active Sprint'
    });

    setTitle('');
    setDescription('');
    setProgress(0);
    setIsModalOpen(false);
  };

  const milestones = [
    {
      title: "Exp 1-4: Foundation & RESTful CRUD Engine",
      date: "Completed · 21 Oct 2026",
      desc: "MongoDB Atlas cluster integration, Express routing, and dynamic data binding.",
      status: "Done"
    },
    {
      title: "Exp 5-6: JWT Auth, RBAC & Security Middleware",
      date: "Completed · 22 Oct 2026",
      desc: "Helmet security headers, bcrypt password hashing, and role authorization.",
      status: "Done"
    },
    {
      title: "Exp 7: Multi-Service Architecture Setup",
      date: "Completed · 25 Oct 2026",
      desc: "Client-server architecture with Vite on 5173, Express on 5000, and persistent database.",
      status: "Done"
    },
    {
      title: "Exp 8-9: WebSockets & Performance Analytics",
      date: "Completed · 26 Oct 2026",
      desc: "Bi-directional real-time chat, latency monitoring, and sprint velocity reporting.",
      status: "Done"
    },
    {
      title: "Sprint 24: Workspace & UX Polish",
      date: "Active Sprint · 28 Oct 2026",
      desc: "Human-crafted workspace layout, Kanban task board, and executive dashboard.",
      status: "In Progress"
    }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Projects & Roadmaps</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active sprints, project roadmaps, and delivery milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {safeProjects.length === 0 && (
            <button
              onClick={loadSampleData}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs border border-slate-200 transition cursor-pointer"
            >
              ⚡ Load Sample Data
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition active:scale-[0.99] cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Project Milestone</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Active Sprints</div>
          <div className="text-2xl font-bold text-slate-900">{safeProjects.length}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">{safeProjects.length === 0 ? "No active sprints" : "On Schedule"}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Sprint Progress</div>
          <div className="text-2xl font-bold text-slate-900">{overallRate}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200/50">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${overallRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Backlog Tasks</div>
          <div className="text-2xl font-bold text-slate-900">{safeTasks.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">{completedTasks} completed</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Service Status</div>
          <div className="text-2xl font-bold text-emerald-600">Healthy</div>
          <div className="text-[11px] text-slate-500 mt-1">API & WebSocket Live</div>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Workspaces ({safeProjects.length})
          </h2>
          {safeProjects.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Project
            </button>
          )}
        </div>

        {safeProjects.length === 0 ? (
          <div className="bg-white border border-slate-200 p-8 rounded-xl text-center shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-sm font-semibold">
              📁
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">No projects created yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                You currently have 0 active projects. Create your first sprint roadmap to organize tasks, or load sample sprint data to preview.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition cursor-pointer"
              >
                + Create Project
              </button>
              <button
                onClick={loadSampleData}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition cursor-pointer"
              >
                ⚡ Load Sample Data
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeProjects.map((proj) => (
              <div 
                key={proj.id}
                className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-xl shadow-2xs transition duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {proj.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">
                        {proj.dueDate}
                      </span>
                      <button
                        onClick={() => removeProject(proj.id)}
                        className="text-slate-400 hover:text-rose-600 transition text-xs p-0.5"
                        title="Delete project"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{proj.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div>
                  {/* Progress */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-semibold text-slate-800">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${proj.progress}%` }}></div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center -space-x-1">
                      {proj.members?.map((m, idx) => (
                        <div 
                          key={idx}
                          className="w-5 h-5 rounded-full bg-slate-200 border border-white text-slate-700 font-semibold text-[9px] flex items-center justify-center shadow-2xs"
                          title={m}
                        >
                          {m.slice(0, 1)}
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/kanban"
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 transition"
                    >
                      View board →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sprint Roadmap Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Delivery Milestones
        </h2>

        <div className="relative border-l border-slate-200 ml-3 space-y-4">
          {milestones.map((ms, idx) => (
            <div key={idx} className="relative pl-5 group">
              <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                ms.status === 'Done' ? 'bg-emerald-500' : 'bg-blue-600 ring-2 ring-blue-100'
              }`} />

              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-lg group-hover:border-slate-300 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="text-xs font-semibold text-slate-800">
                    {ms.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {ms.date}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {ms.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create New Project Milestone</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of sprint milestones, goals, and deliverables..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="e.g. 15 Dec 2026"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Initial Progress ({progress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    className="w-full mt-2 accent-slate-900"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
