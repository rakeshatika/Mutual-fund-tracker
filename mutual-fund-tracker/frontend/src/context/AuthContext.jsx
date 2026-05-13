import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mf_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((userData) => {
    localStorage.setItem('mf_user', JSON.stringify(userData));
    localStorage.setItem('mf_token', userData.token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mf_user');
    localStorage.removeItem('mf_token');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  // DEBUG — remove after confirming role is working
  if (user) console.log('[AuthContext] user role:', user.role, '| isAdmin:', isAdmin);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
