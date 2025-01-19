import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { addToWatchlist } from '../../services/movieApi'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

interface AddToWatchlistButtonProps {
  movieId: number | string
  title: string
  coverImage: string
}

const AddToWatchlistButton = ({ movieId, title, coverImage }: AddToWatchlistButtonProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddToWatchlist = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await addToWatchlist({
        movieId: movieId.toString(),
        title,
        coverImage
      })
    } catch (err) {
      setError('Failed to add to watchlist')
      console.error('Add to watchlist error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    console.error(error)
  }

  return (
    <button
      onClick={handleAddToWatchlist}
      disabled={isLoading}
      className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
    >
      <PlusIcon className="h-5 w-5" />
      {isLoading ? 'Adding...' : 'Add to Watchlist'}
    </button>
  )
}

export default AddToWatchlistButton 