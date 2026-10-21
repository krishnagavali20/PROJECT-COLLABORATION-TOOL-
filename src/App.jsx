import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Navbar from './components/Navbar';
import { UserContext } from './context/UserContext';
import { TaskProvider } from './context/TaskContext';

export default function App() {
  const currentUser = { name: 'Krishna', role: 'Lead Developer' };

  return (
    <UserContext.Provider value={currentUser}>
      <TaskProvider>
        <BrowserRouter>
          {/* Your new Indigo gradient background wrapping the entire app */}
          <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-50 to-indigo-100 selection:bg-indigo-100">
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TaskProvider>
    </UserContext.Provider>
  );
}