import React from 'react';
import { Header } from './Header';
import { StatsCards } from './StatsCards';
import { CryptoTable } from './CryptoTable';
import { Portfolio } from './Portfolio';
import { User } from '../types';
import { useCrypto } from '../hooks/useCrypto';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const { cryptoData, isLoading } = useCrypto();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Track your cryptocurrency investments and market trends
          </p>
        </div>

        <StatsCards cryptoData={cryptoData} isLoading={isLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <CryptoTable cryptoData={cryptoData} isLoading={isLoading} />
          </div>
          <div>
            <Portfolio />
          </div>
        </div>
      </main>
    </div>
  );
};
