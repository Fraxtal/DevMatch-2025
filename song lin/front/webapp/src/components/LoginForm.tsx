import React from 'react';
import { Wallet, TrendingUp, BarChart3, Target, AlertCircle, X, Coins, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { GlassCard } from './GlassCard';
import { SplashScreen } from './SplashScreen';

export const LoginForm: React.FC = () => {
  const { authState, login, clearError } = useAuth();

  // Show initialization loading screen
  if (authState.isInitializing) {
    return <SplashScreen isLoading={true} message="Initializing prediction markets..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background matching app theme */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100" />
      
              {/* Animated floating elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Floating prediction market themed icons */}
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
        <GlassCard className="p-8" blur="lg" opacity={0.15}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-4 shadow-lg">
              <TrendingUp className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">PredictionSteem</h1>
            <p className="text-gray-600 font-medium mb-2">Social Prediction Market</p>
            <p className="text-sm text-gray-500">Join the future of prediction markets with MetaMask</p>
          </div>

                    {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <GlassCard className="p-4 text-center" opacity={0.05}>
              <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">Live Markets</p>
            </GlassCard>
            <GlassCard className="p-4 text-center" opacity={0.05}>
              <Coins className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-medium">PRED Tokens</p>
            </GlassCard>
          </div>

          {/* MetaMask Status Check */}
          {(() => {
            const isMetaMaskAvailable = typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
            return (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${isMetaMaskAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={isMetaMaskAvailable ? 'text-green-600' : 'text-red-600'}>
                    MetaMask {isMetaMaskAvailable ? 'Detected' : 'Not Detected'}
                  </span>
                </div>
                {!isMetaMaskAvailable && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please install MetaMask extension to continue
                  </p>
                )}
              </div>
            );
          })()}

          {/* MetaMask Login Button */}
          <div className="space-y-3">
            <button
              onClick={login}
              disabled={authState.isLoading}
              className={`
                w-full flex items-center justify-center gap-3 p-4 rounded-xl
                bg-gradient-to-r from-orange-500 to-orange-600
                text-white font-medium
                hover:shadow-lg hover:scale-[1.02]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                backdrop-blur-sm
                ${authState.isLoading ? 'ring-2 ring-white/50' : ''}
              `}
            >
              {authState.isLoading ? (
                <>
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  <span>Connect with MetaMask</span>
                </>
              )}
            </button>
          </div>

          {/* Global loading indicator for MetaMask connection */}
          {authState.isLoading && (
            <GlassCard className="mt-6 p-4" opacity={0.1}>
              <div className="flex items-center justify-center gap-4">
                <div className="relative">
                  {/* Elegant loading spinner */}
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-pulse opacity-10"></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  Connecting to MetaMask...
                </span>
              </div>
            </GlassCard>
          )}

          {/* Enhanced Error Message */}
          {authState.error && (
            <GlassCard className="mt-4 p-4 bg-red-50/50 border-red-200/50" opacity={0.1}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-700 text-sm font-medium mb-1">Authentication Failed</p>
                  <p className="text-red-600 text-xs mb-3">{authState.error}</p>
                  
                  {/* Troubleshooting Tips */}
                  <div className="text-xs text-red-600">
                    <p className="font-medium mb-1">Troubleshooting Tips:</p>
                    <ul className="list-disc list-inside space-y-1 text-red-500">
                      {authState.error.includes('not installed') && (
                        <li>Install MetaMask browser extension from <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-700">metamask.io</a></li>
                      )}
                      {authState.error.includes('rejected') && (
                        <li>Click "Connect" when MetaMask popup appears</li>
                      )}
                      {authState.error.includes('unlock') && (
                        <li>Unlock your MetaMask wallet by entering your password</li>
                      )}
                      {authState.error.includes('pending') && (
                        <li>Check if MetaMask has a pending request and approve it</li>
                      )}
                      {!authState.error.includes('not installed') && (
                        <>
                          <li>Refresh this page and try again</li>
                          <li>Make sure MetaMask extension is enabled</li>
                          <li>Check if MetaMask is unlocked</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-red-200/50">
                <button
                  onClick={() => {
                    clearError();
                    // Small delay to allow error to clear before retrying
                    setTimeout(() => login(), 100);
                  }}
                  className="text-red-600 text-xs hover:text-red-800 font-medium underline"
                >
                  Try Again
                </button>
              </div>
            </GlassCard>
          )}

          {/* Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Powered by Ethereum & MetaMask
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Start predicting • Start earning • Start winning
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
