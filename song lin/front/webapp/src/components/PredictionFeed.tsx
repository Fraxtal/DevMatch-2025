import React from 'react'
import PredictionCard from './PredictionCard'
import { Prediction } from '../App'

interface PredictionFeedProps {
  filter?: string
  predictions: Prediction[]
  onStake: (predictionId: number, vote: 'yes' | 'no', amount: number) => boolean
  userTokens: number
}

const PredictionFeed: React.FC<PredictionFeedProps> = ({ filter = 'feed', predictions, onStake, userTokens }) => {
  const getTitle = () => {
    switch (filter) {
      case 'trending':
        return 'Trending Predictions'
      case 'my-predictions':
        return 'My Predictions'
      default:
        return 'Latest Predictions'
    }
  }

  const getFilteredPredictions = () => {
    switch (filter) {
      case 'my-predictions':
        return predictions.filter(p => p.author === 'You' || p.userVote)
      case 'trending':
        return [...predictions].sort((a, b) => b.totalStaked - a.totalStaked)
      default:
        return predictions
    }
  }

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{getTitle()}</h2>
        <p className="text-gray-600">
          {filter === 'trending' 
            ? 'Most popular predictions right now'
            : filter === 'my-predictions'
            ? 'Your prediction history and active bets'
            : 'Discover and vote on the latest predictions'
          }
        </p>
      </div>

      <div className="space-y-6">
        {getFilteredPredictions().map((prediction) => (
          <PredictionCard 
            key={prediction.id} 
            prediction={prediction} 
            onStake={onStake}
            userTokens={userTokens}
          />
        ))}
      </div>
    </div>
  )
}

export default PredictionFeed
