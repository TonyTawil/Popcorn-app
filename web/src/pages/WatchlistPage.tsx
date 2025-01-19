import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface WatchlistMovie {
  movieId: string
  title: string
  coverImage: string
}

const WatchlistPage = () => {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch('/api/movies/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: user?._id }),
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to fetch watchlist')
        }

        const data = await response.json()
        setWatchlist(data.watchList)
      } catch (err) {
        setError('Failed to load watchlist')
        console.error('Watchlist fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchWatchlist()
    }
  }, [user])

  const removeFromWatchlist = async (movieId: string) => {
    try {
      const response = await fetch('/api/movies/watchlist/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?._id, movieId }),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to remove movie from watchlist')
      }

      const data = await response.json()
      setWatchlist(data.watchList)
    } catch (err) {
      console.error('Remove from watchlist error:', err)
    }
  }

  const markAsWatched = async (movie: WatchlistMovie) => {
    try {
      const response = await fetch('/api/movies/watched/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?._id,
          movieId: movie.movieId,
          title: movie.title,
          coverImage: movie.coverImage
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to mark movie as watched')
      }

      const data = await response.json()
      setWatchlist(data.watchList)
    } catch (err) {
      console.error('Mark as watched error:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-gray-400 text-center">Your watchlist is empty</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <div 
              key={movie.movieId} 
              className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
            >
              <img 
                src={movie.coverImage} 
                alt={movie.title} 
                className="w-full h-[300px] object-cover"
              />
              <div className="p-4">
                <h3 className="text-white font-medium mb-2">{movie.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAsWatched(movie)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Watched
                  </button>
                  <button
                    onClick={() => removeFromWatchlist(movie.movieId)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WatchlistPage 