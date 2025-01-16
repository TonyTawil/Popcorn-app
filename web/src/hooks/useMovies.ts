import { useState, useCallback } from 'react'
import { MovieSectionState } from '../types/movie'
import { fetchMovies } from '../services/api'

const initialMovieSection = {
  data: [],
  isLoading: true,
  error: null,
  page: 1,
}

export const useMovies = () => {
  const [trending, setTrending] = useState<MovieSectionState>(initialMovieSection)
  const [nowPlaying, setNowPlaying] = useState<MovieSectionState>(initialMovieSection)
  const [upcoming, setUpcoming] = useState<MovieSectionState>(initialMovieSection)

  const fetchMovieSection = useCallback(async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<MovieSectionState>>,
    page: number = 1
  ) => {
    setter(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetchMovies(endpoint, page)
      setter(prev => ({
        data: page === 1 ? response.results : [...prev.data, ...response.results],
        isLoading: false,
        error: null,
        page,
      }))
    } catch (error) {
      setter(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load movies',
      }))
    }
  }, [])

  return {
    trending,
    nowPlaying,
    upcoming,
    setTrending,
    setNowPlaying,
    setUpcoming,
    fetchMovieSection,
  }
} 