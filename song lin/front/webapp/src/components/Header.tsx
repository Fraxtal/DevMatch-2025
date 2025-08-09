import React from 'react'
import { TrendingUp, Plus, Search, Bell, User, Coins, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface HeaderProps {
  onCreateClick: () => void
  userTokens: number
  onAvatarClick?: () => void
  onTopUpClick?: () => void
}

const Header: React.FC<HeaderProps> = ({ onCreateClick, userTokens, onAvatarClick, onTopUpClick }) => {
  const { authState, logout } = useAuth()
  
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PredictionSteem
              </h1>
              <p className="text-xs text-gray-600">Social Prediction Market</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search predictions..."
                className="w-full pl-10 pr-4 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Token Balance (click to top up) */}
            <button
              onClick={onTopUpClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30 transition-colors"
              title="Top up PRED tokens"
            >
              <Coins className="h-4 w-4 text-purple-600" />
              <span className="font-bold text-purple-600">{userTokens.toLocaleString()}</span>
              <span className="text-xs text-gray-600">PRED</span>
            </button>

            <button
              onClick={onCreateClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </button>

            <button className="p-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 text-gray-600 hover:bg-white/30 transition-all duration-200">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onAvatarClick}
                className="flex items-center space-x-3 group"
                title="Top up PRED tokens"
              >
                {authState.user?.picture && (
                  <img
                    src={authState.user.picture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-white/30 group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-700">{authState.user?.name || 'MetaMask User'}</p>
                  <p className="text-xs text-gray-500 font-mono">{authState.user?.address}</p>
                </div>
              </button>
              <button
                onClick={() => {
                  console.log('Logout button clicked');
                  logout();
                }}
                className="p-2 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 text-gray-600 hover:bg-white/30 hover:text-red-600 transition-all duration-200"
                title="Disconnect Wallet & Clear Session"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
