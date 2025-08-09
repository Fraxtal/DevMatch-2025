import React from 'react'
import { Home, TrendingUp, User, Trophy, Settings, Coins } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userTokens: number
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, userTokens }) => {
  const menuItems = [
    { id: 'feed', label: 'Home Feed', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'my-predictions', label: 'My Predictions', icon: User },
  ]

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 border border-blue-200/50'
                    : 'text-gray-600 hover:bg-white/20 hover:text-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Token Balance Card */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Your Balance</h3>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-600 mb-2">{userTokens.toLocaleString()}</p>
          <p className="text-sm text-gray-600">PRED Tokens</p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Predictions Made</span>
            <span className="font-bold text-blue-600">24</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Accuracy Rate</span>
            <span className="font-bold text-green-600">78%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Staked</span>
            <span className="font-bold text-orange-600">3,420</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Rank</span>
            <span className="font-bold text-purple-600">#42</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-white/20 hover:text-gray-800 transition-all duration-200">
            <Trophy className="h-5 w-5" />
            <span>Leaderboard</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-white/20 hover:text-gray-800 transition-all duration-200">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
