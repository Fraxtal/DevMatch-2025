import React from 'react';
import { Chrome, Apple, Twitch, Facebook, Shield, Zap, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { GlassCard } from './GlassCard';

const providers = [
  { id: 'google', name: 'Google', icon: Chrome, color: 'from-blue-500 to-blue-600' },
  { id: 'apple', name: 'Apple', icon: Apple, color: 'from-gray-700 to-gray-800' },
  { id: 'twitch', name: 'Twitch', icon: Twitch, color: 'from-purple-500 to-purple-600' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700' },
];

export const LoginForm: React.FC = () => {
  const { authState, login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100" />
      
      {/* Floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-200/20 to-blue-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="p-8" blur="lg" opacity={0.15}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">zkLogin Auth</h1>
            <p className="text-gray-600">Secure Web3 authentication with zero-knowledge proofs</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <GlassCard className="p-4 text-center" opacity={0.05}>
              <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">Fast Login</p>
            </GlassCard>
            <GlassCard className="p-4 text-center" opacity={0.05}>
              <Lock className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">Private & Secure</p>
            </GlassCard>
          </div>

          {/* Login Buttons */}
          <div className="space-y-3">
            {providers.map((provider) => {
              const Icon = provider.icon;
              return (
                <button
                  key={provider.id}
                  onClick={() => login(provider.id)}
                  disabled={authState.isLoading}
                  className={`
                    w-full flex items-center justify-center gap-3 p-4 rounded-xl
                    bg-gradient-to-r ${provider.color}
                    text-white font-medium
                    hover:shadow-lg hover:scale-[1.02]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    backdrop-blur-sm
                  `}
                >
                  {authState.isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  Continue with {provider.name}
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {authState.error && (
            <GlassCard className="mt-4 p-4 bg-red-50/50 border-red-200/50" opacity={0.1}>
              <p className="text-red-600 text-sm text-center">{authState.error}</p>
            </GlassCard>
          )}

          {/* Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Powered by Sui zkLogin & Enoki
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
