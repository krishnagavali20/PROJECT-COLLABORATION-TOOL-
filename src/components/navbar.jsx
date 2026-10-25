import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { UserContext } from '../context/UserContext';

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useContext(TaskContext);
  const user = useContext(UserContext);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white/75 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="flex items-center space-x-6">
        <Link to="/" className="bg-indigo-600 text-white font-bold px-2.5 py-1 rounded text-sm hover:bg-indigo-700 transition">
          Nexus
        </Link>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4 text-sm font-medium">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition font-semibold">Live Chat</Link>
          <Link to="/kanban" className="text-slate-600 hover:text-indigo-600 transition">Kanban Board</Link>
          <Link to="/analytics" className="text-slate-600 hover:text-indigo-600 transition">Analytics</Link>
          <Link to="/docker" className="text-slate-600 hover:text-indigo-600 transition">Docker Status</Link>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Live Search Input */}
        <input 
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-xs px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white"
        />
        <div className="flex flex-col text-right">
          <p className="text-xs font-bold text-slate-800">{user?.name}</p>
          <p className="text-[10px] text-slate-500">{user?.role}</p>
        </div>
      </div>
    </header>
  );
}