import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Movie } from '../types/movie'
import { fetchMovies } from '../services/api'
import MovieGrid from '../components/movies/MovieGrid'
import MovieGridSkeleton from '../components/loading/MovieGridSkeleton'

type CategoryTitles = {
  [key: string]: string
  trending: string
  now_playing: string
  upcoming: string
}

const categoryTitles: CategoryTitles = {
  trending: 'Trending Movies',
  now_playing: 'Now Playing',
  upcoming: 'Upcoming Movies'
}

const AllMoviesPage = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categoryTitle = category ? categoryTitles[category] : ''
  const endpoint = category === 'trending' ? '/movie/trending' : `/type/${category}`

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetchMovies(endpoint, page)
        setMovies(prev => page === 1 ? response.results : [...prev, ...response.results])
        setTotalPages(response.total_pages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movies')
      } finally {
        setIsLoading(false)
      }
    }

    if (category) {
      loadMovies()
    }
  }, [category, page, endpoint])

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`)
  }

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1)
    }
  }

  if (!category || !categoryTitles[category]) {
    return <div className="text-red-500">Invalid category</div>
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{categoryTitle}</h1>
        
        {!isLoading && <MovieGrid movies={movies} onMovieClick={handleMovieClick} />}
        {isLoading && <MovieGridSkeleton />}
        {error && <div className="text-red-500 mt-4">{error}</div>}

        {page < totalPages && !isLoading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllMoviesPage 