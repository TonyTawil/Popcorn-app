import { useState } from 'react'
import { addToWatchlist, removeFromWatchlist, addToWatched, removeFromWatched } from '../../services/api'

type MovieActionsProps = {
  movieId: number
  title: string
  posterPath: string
  isInWatchlist: boolean
  isInWatched: boolean
  onStatusChange: () => void
}

const MovieActions = ({ 
  movieId, 
  title, 
  posterPath, 
  isInWatchlist, 
  isInWatched,
  onStatusChange 
}: MovieActionsProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddToWatchlist = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await addToWatchlist({
        movieId,
        title,
        coverImage: `https://image.tmdb.org/t/p/w500${posterPath}`
      })
      onStatusChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to watchlist')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromWatchlist = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await removeFromWatchlist(movieId)
      onStatusChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from watchlist')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWatched = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await addToWatched({
        movieId,
        title,
        coverImage: `https://image.tmdb.org/t/p/w500${posterPath}`
      })
      onStatusChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to watched')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromWatched = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await removeFromWatched(movieId)
      onStatusChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from watched')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {isInWatched ? (
        <button
          onClick={handleRemoveFromWatched}
          disabled={isLoading}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full transition-colors"
        >
          Remove from Watched
        </button>
      ) : (
        <button
          onClick={handleAddToWatched}
          disabled={isLoading}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full transition-colors"
        >
          Mark as Watched
        </button>
      )}

      {isInWatchlist ? (
        <button
          onClick={handleRemoveFromWatchlist}
          disabled={isLoading}
          className="border-2 border-primary hover:bg-primary/10 text-primary px-4 py-2 rounded-full transition-colors"
        >
          Remove from Watchlist
        </button>
      ) : (
        <button
          onClick={handleAddToWatchlist}
          disabled={isLoading || isInWatched}
          className="border-2 border-primary hover:bg-primary/10 text-primary px-4 py-2 rounded-full transition-colors"
        >
          Add to Watchlist
        </button>
      )}

      {error && <p className="text-red-500 w-full">{error}</p>}
    </div>
  )
}

export default MovieActions 