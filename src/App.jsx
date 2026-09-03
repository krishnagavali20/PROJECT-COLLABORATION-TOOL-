import Dashboard from './components/Dashboard';
import { UserContext } from './context/UserContext';

export default function App() {
  const currentUser = {
    name: 'Krishna',
    role: 'Lead Developer'
  };

  return (
    <UserContext.Provider value={currentUser}>
      <Dashboard />
    </UserContext.Provider>
  );
}