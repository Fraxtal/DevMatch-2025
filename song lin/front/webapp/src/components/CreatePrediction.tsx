import React, { useState } from 'react'
import { X, Calendar, Tag, Image as ImageIcon, AlertCircle, Coins } from 'lucide-react'
import { Prediction } from '../App'

interface CreatePredictionProps {
  onClose: () => void
  onCreate: (prediction: Omit<Prediction, 'id' | 'author' | 'authorAvatar' | 'timeAgo' | 'yesVotes' | 'noVotes' | 'totalStaked'>) => boolean
  userTokens: number
}

const CreatePrediction: React.FC<CreatePredictionProps> = ({ onClose, onCreate, userTokens }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [endDate, setEndDate] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    'Cryptocurrency',
    'Technology',
    'Stocks',
    'Sports',
    'Politics',
    'Entertainment',
    'Science',
    'Space'
  ]

  const creationCost = 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Validation
    if (!title.trim()) {
      setError('Please enter a prediction title')
      setIsSubmitting(false)
      return
    }

    if (!description.trim()) {
      setError('Please enter a description')
      setIsSubmitting(false)
      return
    }

    if (!category) {
      setError('Please select a category')
      setIsSubmitting(false)
      return
    }

    if (!endDate) {
      setError('Please select an end date')
      setIsSubmitting(false)
      return
    }

    // Check if end date is in the future
    const selectedDate = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate <= today) {
      setError('End date must be in the future')
      setIsSubmitting(false)
      return
    }

    // Check if user has enough tokens
    if (userTokens < creationCost) {
      setError(`Insufficient tokens. You need ${creationCost} PRED to create a prediction.`)
      setIsSubmitting(false)
      return
    }

    // Format end date for display
    const formattedEndDate = selectedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    const newPrediction = {
      title: title.trim(),
      description: description.trim(),
      category,
      endDate: formattedEndDate,
      image: imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop'
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (onCreate(newPrediction)) {
      onClose()
    } else {
      setError('Failed to create prediction. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-gray-800">Create New Prediction</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-600 hover:bg-white/20 transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prediction Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Will Bitcoin reach $100K by end of 2024?"
              className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/200 characters</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context and reasoning for your prediction..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
          </div>

          {/* Category and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="inline h-4 w-4 mr-1" />
              Image URL (optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/30 border border-white/40 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="rounded-xl overflow-hidden">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Token Balance and Cost */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-white/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-gray-800">Token Requirements</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Your Balance</p>
                <p className="font-bold text-purple-600">{userTokens.toLocaleString()} PRED</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Creation Cost:</span>
                <span className="font-bold text-blue-600">{creationCost} PRED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining Balance:</span>
                <span className={`font-bold ${userTokens >= creationCost ? 'text-green-600' : 'text-red-600'}`}>
                  {(userTokens - creationCost).toLocaleString()} PRED
                </span>
              </div>
            </div>

            {userTokens < creationCost && (
              <div className="mt-3 p-2 rounded-lg bg-red-50/50 border border-red-200/50 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">Insufficient tokens to create prediction</span>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-50/50 to-orange-50/50 border border-yellow-200/50">
            <h4 className="font-semibold text-gray-800 mb-2">Guidelines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Prediction must be verifiable and have a clear outcome</li>
              <li>• End date must be in the future</li>
              <li>• Avoid inappropriate or offensive content</li>
              <li>• Community will moderate content quality</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-200/50 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-500/20 text-gray-700 border border-gray-300 hover:bg-gray-500/30 transition-all duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || userTokens < creationCost}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Creating...' : `Create Prediction (${creationCost} PRED)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePrediction
