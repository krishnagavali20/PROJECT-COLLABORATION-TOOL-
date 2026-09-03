import React, { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useFetch } from '../hooks/useFetch';

export default function Dashboard() {
  // 1. useContext(): Access shared user info
  const user = useContext(UserContext);

  // 2. Custom Hook: Fetch data
  const { data } = useFetch('https://jsonplaceholder.typicode.com/todos/1');

  // 3. useEffect(): Update document title & run on mount
  useEffect(() => {
    document.title = 'Dashboard - Nexus Collaboration';
    console.log('Dashboard loaded successfully');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded text-sm">Nexus</span>
          </div>
          <nav className="hidden md:flex space-x-4 text-sm text-slate-600 font-medium">
            <a href="#" className="hover:text-slate-900">Projects</a>
            <a href="#" className="hover:text-slate-900">Filters</a>
            <a href="#" className="hover:text-slate-900 text-blue-600">Dashboards</a>
          </nav>
        </div>

        {/* User Context demonstration in the Top Bar */}
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white text-sm font-medium px-3.5 py-1.5 rounded-md hover:bg-blue-700">
            Create Task
          </button>
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
              {user?.name?.slice(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <p className="text-xs font-semibold">{user?.name || 'Guest'}</p>
              <p className="text-[10px] text-slate-500">{user?.role || 'Member'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Board Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">FD</span>
              <h1 className="text-xl font-bold text-slate-900">Frontend Development</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">Sprint 4 • Active</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex -space-x-1.5 text-xs font-medium text-white">
              <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center border border-white">JD</span>
              <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center border border-white">AS</span>
              <span className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center border border-white">+2</span>
            </div>
            <button className="text-xs font-medium px-3 py-1 border border-slate-300 rounded hover:bg-slate-100">
              Share
            </button>
          </div>
        </div>

        {/* Custom Hook & useEffect Output Banner */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
          <div>
            <span className="font-semibold uppercase tracking-wider text-[10px] bg-blue-200 px-1.5 py-0.5 rounded mr-2">
              Fetched via useFetch
            </span>
            <span>Task Data: <strong>{data ? data.title : 'Fetching from API...'}</strong></span>
          </div>
          <span className="text-blue-600 font-mono text-[11px]">Status: 200 OK</span>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: TO DO */}
          <div className="bg-slate-100/70 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-600">
              <span>TO DO <span className="text-slate-400 ml-1">2</span></span>
              <span>•••</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">DESIGN</span>
                <p className="text-xs font-medium text-slate-800 mt-2">Design responsive frontend pages (Home, Login, Dashboard)</p>
                <p className="text-[10px] text-slate-400 mt-3 font-mono">NEX-101</p>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                <p className="text-xs font-medium text-slate-800">Setup Tailwind CSS architecture</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-slate-400 font-mono">NEX-102</span>
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-[10px] text-white flex items-center justify-center font-bold">AS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: IN PROGRESS */}
          <div className="bg-slate-100/70 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-600">
              <span>IN PROGRESS <span className="text-slate-400 ml-1">1</span></span>
              <span>•••</span>
            </div>

            <div className="bg-white p-3 rounded border-l-2 border-l-blue-600 border border-slate-200 shadow-sm">
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">EXP 2</span>
              <p className="text-xs font-medium text-slate-800 mt-2">Implement React Hooks & Custom Data Fetching</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-slate-400 font-mono">NEX-103</span>
                <span className="w-5 h-5 rounded-full bg-blue-500 text-[10px] text-white flex items-center justify-center font-bold">JD</span>
              </div>
            </div>
          </div>

          {/* Column 3: Add Column */}
          <div>
            <button className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 transition">
              + Add Column
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}