import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('kobo_user');
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('kobo_token') || null;
    } catch {
      return null;
    }
  });

  const login = (userData, userToken) => {
    const formatted = {
      name: userData?.name || 'User',
      profession: userData?.profession || 'Full-Stack Developer',
      email: userData?.email || '',
      role: userData?.role || 'user'
    };
    setUser(formatted);
    if (userToken) setToken(userToken);

    try {
      localStorage.setItem('kobo_user', JSON.stringify(formatted));
      if (userToken) localStorage.setItem('kobo_token', userToken);
    } catch {
      // Ignore
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('kobo_user');
      localStorage.removeItem('kobo_token');
    } catch {
      // Ignore
    }
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </UserContext.Provider>
  );
}