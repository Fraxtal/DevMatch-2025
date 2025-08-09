import React from 'react'
import { Trophy, TrendingUp, Award, Star } from 'lucide-react'

const Leaderboard: React.FC = () => {
  const topPredictors = [
    {
      rank: 1,
      name: "PredictionMaster",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      accuracy: 89,
      totalPredictions: 156,
      tokens: 25420
    },
    {
      rank: 2,
      name: "CryptoOracle",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      accuracy: 87,
      totalPredictions: 134,
      tokens: 22180
    },
    {
      rank: 3,
      name: "TechSeer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      accuracy: 85,
      totalPredictions: 98,
      tokens: 19750
    },
    {
      rank: 4,
      name: "MarketWizard",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      accuracy: 83,
      totalPredictions: 87,
      tokens: 17320
    },
    {
      rank: 5,
      name: "FutureGuru",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      accuracy: 81,
      totalPredictions: 76,
      tokens: 15890
    }
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />
      case 3:
        return <Star className="h-5 w-5 text-orange-500" />
      default:
        return <span className="text-sm font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
      default:
        return "bg-white/30 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Leaderboard Header */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Top Predictors</h2>
        </div>
        <p className="text-gray-600 text-sm">
          Rankings based on accuracy and total predictions
        </p>
      </div>

      {/* Top Predictors List */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {topPredictors.map((predictor) => (
              <div
                key={predictor.rank}
                className="flex items-center space-x-4 p-4 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                {/* Rank */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankBadge(predictor.rank)}`}>
                  {getRankIcon(predictor.rank)}
                </div>

                {/* Avatar */}
                <img
                  src={predictor.avatar}
                  alt={predictor.name}
                  className="w-10 h-10 rounded-full border-2 border-white/30"
                />

                {/* Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{predictor.name}</h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>{predictor.accuracy}% accuracy</span>
                    <span>{predictor.totalPredictions} predictions</span>
                  </div>
                </div>

                {/* Tokens */}
                <div className="text-right">
                  <p className="font-bold text-purple-600">{predictor.tokens.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">PRED</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Market Stats</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Active Predictions</span>
            <span className="font-bold text-blue-600">1,247</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Volume</span>
            <span className="font-bold text-green-600">2.4M PRED</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Active Users</span>
            <span className="font-bold text-purple-600">15,892</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Resolved Today</span>
            <span className="font-bold text-orange-600">23</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="text-sm">
            <p className="text-gray-800"><span className="font-semibold">CryptoOracle</span> staked 500 PRED on Bitcoin prediction</p>
            <p className="text-gray-500 text-xs">2 minutes ago</p>
          </div>
          <div className="text-sm">
            <p className="text-gray-800"><span className="font-semibold">TechSeer</span> created a new prediction about AI</p>
            <p className="text-gray-500 text-xs">5 minutes ago</p>
          </div>
          <div className="text-sm">
            <p className="text-gray-800"><span className="font-semibold">MarketWizard</span> won 1,200 PRED tokens</p>
            <p className="text-gray-500 text-xs">12 minutes ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
