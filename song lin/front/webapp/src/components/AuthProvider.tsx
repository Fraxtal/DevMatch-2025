import React from 'react';
import { useAuthState } from '../hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { authState, login, logout, clearError, executeTransaction, AuthContext } = useAuthState();

  return (
    <AuthContext.Provider value={{ authState, login, logout, clearError, executeTransaction }}>
      {children}
    </AuthContext.Provider>
  );
};