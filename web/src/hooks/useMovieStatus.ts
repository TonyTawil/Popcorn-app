import { useState, useEffect, useCallback } from 'react'
import { getWatchlist, getWatched } from '../services/api'

export const useMovieStatus = (movieId: string | undefined) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isInWatched, setIsInWatched] = useState(false)

  const checkMovieStatus = useCallback(async () => {
    if (!movieId) return
    
    try {
      const [watchlist, watched] = await Promise.all([
        getWatchlist(),
        getWatched()
      ])
      
      setIsInWatchlist(watchlist.some((m: any) => m.movieId === Number(movieId)))
      setIsInWatched(watched.some((m: any) => m.movieId === Number(movieId)))
    } catch (err) {
      console.error('Error checking movie status:', err)
    }
  }, [movieId])

  useEffect(() => {
    checkMovieStatus()
  }, [checkMovieStatus])

  return {
    isInWatchlist,
    isInWatched,
    checkMovieStatus
  }
} 