import React from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} isLoading={isLoading} />;
  }

  return <Dashboard user={user} onLogout={logout} />;
}

export default App;
