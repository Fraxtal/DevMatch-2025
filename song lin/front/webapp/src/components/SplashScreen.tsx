import React from 'react';
import { TrendingUp, BarChart3, Coins, Zap, Users, Target } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface SplashScreenProps {
  isLoading?: boolean;
  message?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  isLoading = true, 
  message = "Initializing prediction markets..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100" />
      
        {/* Animated floating elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Floating prediction market icons */}
        <div className="absolute top-20 left-20 animate-float">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/15 to-cyan-500/15 backdrop-blur-sm border border-white/10">
            <BarChart3 className="w-6 h-6 text-blue-600/80" />
          </div>
        </div>
        <div className="absolute top-32 right-32 animate-float" style={{ animationDelay: '0.5s' }}>
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/15 to-pink-500/15 backdrop-blur-sm border border-white/10">
            <Target className="w-6 h-6 text-purple-600/80" />
          </div>
        </div>
        <div className="absolute bottom-32 left-32 animate-float" style={{ animationDelay: '1s' }}>
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 backdrop-blur-sm border border-white/10">
            <Coins className="w-6 h-6 text-green-600/80" />
          </div>
        </div>
        <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/15 to-red-500/15 backdrop-blur-sm border border-white/10">
            <Users className="w-6 h-6 text-orange-600/80" />
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="p-8 text-center" blur="lg" opacity={0.15}>
          {/* Main Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          
          {/* App Title */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            PredictionSteem
          </h1>
          <p className="text-lg text-gray-600 font-medium mb-2">Social Prediction Market</p>
          <p className="text-sm text-gray-500 mb-8">Stake tokens on future events and earn rewards</p>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <GlassCard className="p-3 text-center" opacity={0.05}>
              <BarChart3 className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-gray-700 font-medium">Live Markets</p>
            </GlassCard>
            <GlassCard className="p-3 text-center" opacity={0.05}>
              <Coins className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="text-xs text-gray-700 font-medium">PRED Tokens</p>
            </GlassCard>
            <GlassCard className="p-3 text-center" opacity={0.05}>
              <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-gray-700 font-medium">Predictions</p>
            </GlassCard>
            <GlassCard className="p-3 text-center" opacity={0.05}>
              <Zap className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-xs text-gray-700 font-medium">Instant Staking</p>
            </GlassCard>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Main loading ring */}
                  <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  {/* Inner pulse */}
                  <div className="absolute inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse opacity-20"></div>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-xs text-gray-500">
              Powered by Ethereum & MetaMask
            </p>
          </div>
        </GlassCard>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
