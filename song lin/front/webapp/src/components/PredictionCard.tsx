import React, { useState } from 'react'
import { ChevronUp, ChevronDown, MessageCircle, Share2, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { Prediction } from '../App'

interface PredictionCardProps {
  prediction: Prediction
  onStake: (predictionId: number, vote: 'yes' | 'no', amount: number) => boolean
  userTokens: number
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, onStake, userTokens }) => {
  const [stakeAmount, setStakeAmount] = useState('')
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | null>(null)
  const [error, setError] = useState('')

  const totalVotes = prediction.yesVotes + prediction.noVotes
  const yesPercentage = totalVotes > 0 ? (prediction.yesVotes / totalVotes) * 100 : 50
  const noPercentage = totalVotes > 0 ? (prediction.noVotes / totalVotes) * 100 : 50

  const handleVote = (vote: 'yes' | 'no') => {
    setSelectedVote(vote)
    setShowStakeModal(true)
    setError('')
    setStakeAmount('')
  }

  const handleStakeSubmit = () => {
    const amount = parseInt(stakeAmount)
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (amount > userTokens) {
      setError(`Insufficient tokens. You have ${userTokens.toLocaleString()} PRED`)
      return
    }

    if (selectedVote && onStake(prediction.id, selectedVote, amount)) {
      setShowStakeModal(false)
      setStakeAmount('')
      setError('')
    } else {
      setError('Failed to place stake')
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Cryptocurrency': 'bg-orange-500/20 text-orange-700 border-orange-200',
      'Technology': 'bg-blue-500/20 text-blue-700 border-blue-200',
      'Stocks': 'bg-green-500/20 text-green-700 border-green-200',
      'Space': 'bg-purple-500/20 text-purple-700 border-purple-200',
    }
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-700 border-gray-200'
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={prediction.authorAvatar}
              alt={prediction.author}
              className="w-10 h-10 rounded-full border-2 border-white/30"
            />
            <div>
              <p className="font-semibold text-gray-800">{prediction.author}</p>
              <p className="text-sm text-gray-600">{prediction.timeAgo}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(prediction.category)}`}>
            {prediction.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3">{prediction.title}</h3>
        <p className="text-gray-600 mb-4">{prediction.description}</p>

        {/* Image */}
        <div className="rounded-xl overflow-hidden mb-4">
          <img
            src={prediction.image}
            alt="Prediction"
            className="w-full h-48 object-cover"
          />
        </div>

        {/* User's Stake Display */}
        {prediction.userVote && prediction.userStake && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-green-50/50 to-blue-50/50 border border-green-200/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Your Stake</span>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  prediction.userVote === 'yes' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {prediction.userVote.toUpperCase()}
                </span>
                <span className="font-bold text-blue-600">{prediction.userStake.toLocaleString()} PRED</span>
              </div>
            </div>
          </div>
        )}

        {/* Voting Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Market Sentiment</span>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Ends {prediction.endDate}</span>
            </div>
          </div>
          
          <div className="relative h-3 bg-gray-200/50 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
              style={{ width: `${yesPercentage}%` }}
            />
            <div
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-400 to-red-500 transition-all duration-500"
              style={{ width: `${noPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-green-600 font-medium">
              YES {yesPercentage.toFixed(1)}% ({prediction.yesVotes.toLocaleString()})
            </span>
            <span className="text-red-600 font-medium">
              NO {noPercentage.toFixed(1)}% ({prediction.noVotes.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Stake Info */}
        <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-white/30">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Total Staked</span>
          </div>
          <span className="font-bold text-blue-600">{prediction.totalStaked.toLocaleString()} PRED</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={() => handleVote('yes')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                prediction.userVote === 'yes'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-green-500/20 text-green-700 border border-green-200 hover:bg-green-500/30'
              }`}
            >
              <ChevronUp className="h-4 w-4" />
              <span>YES</span>
            </button>
            
            <button
              onClick={() => handleVote('no')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                prediction.userVote === 'no'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-red-500/20 text-red-700 border border-red-200 hover:bg-red-500/30'
              }`}
            >
              <ChevronDown className="h-4 w-4" />
              <span>NO</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-600 hover:bg-white/20 transition-all duration-200">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">24</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-600 hover:bg-white/20 transition-all duration-200">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stake Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Stake on {selectedVote?.toUpperCase()}
            </h3>
            <p className="text-gray-600 mb-4">
              How many PRED tokens do you want to stake on this prediction?
            </p>
            
            {/* Available Balance */}
            <div className="mb-4 p-3 rounded-xl bg-blue-50/50 border border-blue-200/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Balance:</span>
                <span className="font-bold text-blue-600">{userTokens.toLocaleString()} PRED</span>
              </div>
            </div>
            
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => {
                setStakeAmount(e.target.value)
                setError('')
              }}
              placeholder="Enter amount..."
              min="1"
              max={userTokens}
              className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-4"
            />

            {/* Quick Amount Buttons */}
            <div className="flex space-x-2 mb-4">
              {[10, 50, 100, Math.floor(userTokens / 4)].filter(amount => amount <= userTokens && amount > 0).map((amount) => (
                <button
                  key={amount}
                  onClick={() => setStakeAmount(amount.toString())}
                  className="px-3 py-1 rounded-lg bg-white/20 text-gray-700 text-sm hover:bg-white/30 transition-all duration-200"
                >
                  {amount}
                </button>
              ))}
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50/50 border border-red-200/50 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowStakeModal(false)
                  setError('')
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-500/20 text-gray-700 border border-gray-300 hover:bg-gray-500/30 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleStakeSubmit}
                disabled={!stakeAmount || parseInt(stakeAmount) <= 0}
                className={`flex-1 px-4 py-2 rounded-xl text-white font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedVote === 'yes'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-xl'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-xl'
                }`}
              >
                Stake {stakeAmount || '0'} PRED
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictionCard
