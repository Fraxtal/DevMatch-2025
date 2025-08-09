import React, { useState } from 'react'
import { AuthProvider } from './components/AuthProvider'
import { LoginForm } from './components/LoginForm'
import { useAuth } from './hooks/useAuth'
import Header from './components/Header'
import TopUpModal from './components/TopUpModal'
import Sidebar from './components/Sidebar'
import PredictionFeed from './components/PredictionFeed'
import CreatePrediction from './components/CreatePrediction'
import Leaderboard from './components/Leaderboard'

export interface Prediction {
  id: number
  title: string
  description: string
  author: string
  authorAvatar: string
  timeAgo: string
  yesVotes: number
  noVotes: number
  totalStaked: number
  category: string
  endDate: string
  image: string
  userVote?: 'yes' | 'no' | null
  userStake?: number
}

const PredictionSteemApp: React.FC = () => {
  const { authState } = useAuth()
  const [activeTab, setActiveTab] = useState('feed')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userTokens, setUserTokens] = useState(1250) // Starting balance
  const [showTopUp, setShowTopUp] = useState(false)
  const topUpWindowRef = React.useRef<Window | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: 1,
      title: "Will Bitcoin reach $100K by end of 2024?",
      description: "With increasing institutional adoption and potential ETF approvals, Bitcoin could see significant price appreciation.",
      author: "CryptoAnalyst",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      timeAgo: "2 hours ago",
      yesVotes: 1247,
      noVotes: 856,
      totalStaked: 15420,
      category: "Cryptocurrency",
      endDate: "Dec 31, 2024",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Will OpenAI release GPT-5 before 2025?",
      description: "Given the rapid pace of AI development and OpenAI's roadmap, GPT-5 could arrive sooner than expected.",
      author: "AIResearcher",
      authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      timeAgo: "4 hours ago",
      yesVotes: 892,
      noVotes: 1156,
      totalStaked: 12340,
      category: "Technology",
      endDate: "Dec 31, 2024",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Will Tesla stock hit $300 in 2024?",
      description: "With new model releases and expansion into new markets, Tesla could see significant growth.",
      author: "StockTrader",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      timeAgo: "6 hours ago",
      yesVotes: 654,
      noVotes: 432,
      totalStaked: 8750,
      category: "Stocks",
      endDate: "Dec 31, 2024",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Will the next iPhone have a foldable screen?",
      description: "Apple has been researching foldable technology and could surprise everyone with the iPhone 16.",
      author: "TechInsider",
      authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      timeAgo: "8 hours ago",
      yesVotes: 423,
      noVotes: 789,
      totalStaked: 6890,
      category: "Technology",
      endDate: "Sep 15, 2024",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop"
    },
    {
      id: 5,
      title: "Will SpaceX successfully land humans on Mars by 2030?",
      description: "Elon Musk's ambitious timeline for Mars colonization could become reality with recent Starship progress.",
      author: "SpaceExplorer",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      timeAgo: "12 hours ago",
      yesVotes: 1089,
      noVotes: 567,
      totalStaked: 18920,
      category: "Space",
      endDate: "Dec 31, 2030",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop"
    }
  ])

  const handleStake = (predictionId: number, vote: 'yes' | 'no', amount: number) => {
    if (amount > userTokens) {
      return false // Insufficient funds
    }

    // Deduct tokens from user balance
    setUserTokens(prev => prev - amount)

    // Update prediction with user's vote and stake
    setPredictions(prev => prev.map(prediction => {
      if (prediction.id === predictionId) {
        const updatedPrediction = { ...prediction }
        
        // Add to vote count
        if (vote === 'yes') {
          updatedPrediction.yesVotes += amount
        } else {
          updatedPrediction.noVotes += amount
        }
        
        // Update total staked
        updatedPrediction.totalStaked += amount
        
        // Store user's vote and stake
        updatedPrediction.userVote = vote
        updatedPrediction.userStake = amount
        
        return updatedPrediction
      }
      return prediction
    }))

    return true // Success
  }

  const handleCreatePrediction = (newPrediction: Omit<Prediction, 'id' | 'author' | 'authorAvatar' | 'timeAgo' | 'yesVotes' | 'noVotes' | 'totalStaked'>) => {
    const creationCost = 100 // Minimum stake to create prediction
    
    if (userTokens < creationCost) {
      return false // Insufficient funds
    }

    // Deduct creation cost
    setUserTokens(prev => prev - creationCost)

    // Create new prediction
    const prediction: Prediction = {
      ...newPrediction,
      id: Date.now(), // Simple ID generation
      author: "You", // Current user
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      timeAgo: "Just now",
      yesVotes: creationCost, // Creator's initial stake goes to YES
      noVotes: 0,
      totalStaked: creationCost,
      userVote: 'yes',
      userStake: creationCost
    }

    // Add to predictions list
    setPredictions(prev => [prediction, ...prev])
    return true // Success
  }

  // Listen for top-up/sell messages from embedded top-up app
  React.useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log('Main app received message:', event.data)
      if (!event || !event.data || typeof event.data !== 'object') return

      const { type, delta } = event.data as { type?: string; delta?: number }
      if (type === 'PRED_TOPUP' || type === 'PRED_SELL') {
        console.log(`Processing ${type} with delta:`, delta)
        if (typeof delta === 'number' && !Number.isNaN(delta)) {
          setUserTokens(prev => {
            const newBalance = Math.max(0, prev + Math.round(delta))
            console.log(`Balance updated from ${prev} to ${newBalance}`)
            // Push updated balance back to the sender immediately
            try {
              const source = event.source as Window | null
              if (source) {
                console.log('Sending balance back to zkLogin app:', newBalance)
                source.postMessage({ type: 'PRED_BALANCE', balance: newBalance }, '*')
              }
            } catch (e) {
              console.error('Error sending balance back:', e)
            }
            return newBalance
          })
        }
        return
      }

      if (type === 'REQUEST_PRED_BALANCE') {
        console.log('Received balance request, current balance:', userTokens)
        try {
          const source = event.source as Window | null
          if (source) {
            console.log('Sending current balance to zkLogin app:', userTokens)
            source.postMessage({ type: 'PRED_BALANCE', balance: userTokens }, '*')
          }
        } catch (e) {
          console.error('Error sending balance:', e)
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [userTokens])

  // Show login form if not authenticated
  if (!authState.isAuthenticated) {
    return <LoginForm />
  }

  const handleAvatarClick = () => {
    const url = (import.meta.env.VITE_PROFILE_URL as string) || (import.meta.env.VITE_TOPUP_URL as string) || '/topup/'
    try {
      topUpWindowRef.current = window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      setShowTopUp(true)
    }
  }

  const handleTopUpClick = () => {
    const url = (import.meta.env.VITE_PROFILE_URL as string) || (import.meta.env.VITE_TOPUP_URL as string) || '/topup/'
    try {
      topUpWindowRef.current = window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      setShowTopUp(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-inter">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative z-10">
        <Header onCreateClick={() => setShowCreateModal(true)} userTokens={userTokens} onAvatarClick={handleAvatarClick} onTopUpClick={handleTopUpClick} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userTokens={userTokens} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <PredictionFeed 
                filter={activeTab} 
                predictions={predictions}
                onStake={handleStake}
                userTokens={userTokens}
              />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <Leaderboard />
            </div>
          </div>
        </div>

        {/* Create Prediction Modal */}
        {showCreateModal && (
          <CreatePrediction 
            onClose={() => setShowCreateModal(false)} 
            onCreate={handleCreatePrediction}
            userTokens={userTokens}
          />
        )}

        {/* Top-up Modal with embedded zkLogin app */}
        {showTopUp && (
          <TopUpModal
            isOpen={showTopUp}
            onClose={() => setShowTopUp(false)}
            iframeUrl={import.meta.env.VITE_TOPUP_URL || '/topup/'}
          />
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="font-inter">
        <PredictionSteemApp />
      </div>
    </AuthProvider>
  )
}

export default App
