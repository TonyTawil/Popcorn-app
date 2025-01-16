import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MovieDetails } from '../types/movie'
import { fetchMovieDetails, fetchMovieCredits, fetchSimilarMovies, fetchMovieVideos } from '../services/api'
import { useMovieStatus } from '../hooks/useMovieStatus'
import MovieHero from '../components/movies/MovieHero'
import MovieCast from '../components/movies/MovieCast'
import MovieTrailers from '../components/movies/MovieTrailers'
import SimilarMovies from '../components/movies/SimilarMovies'
import MovieActions from '../components/movies/MovieActions'
import { useAuth } from '../context/AuthContext'

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isInWatchlist, isInWatched, checkMovieStatus } = useMovieStatus(id)
  const { user } = useAuth()

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return
      setIsLoading(true)
      setError(null)
      try {
        const [details, credits, similar, videos] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieCredits(id),
          fetchSimilarMovies(id),
          fetchMovieVideos(id)
        ])

        setMovie({
          ...details,
          credits,
          similar,
          videos
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movie details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetails()
  }, [id])

  const handleSimilarMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`)
    window.scrollTo(0, 0)
  }

  const handleProtectedAction = (action: () => void) => {
    if (!user) {
      // Store the current URL in sessionStorage to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }
    action()
  }

  const handleAddReview = () => {
    handleProtectedAction(() => {
      // Your review adding logic here
      console.log('Adding review...')
    })
  }

  const handleWatchlistAction = () => {
    handleProtectedAction(() => {
      // Your watchlist manipulation logic here
      console.log('Updating watchlist...')
    })
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
  }

  if (error || !movie) {
    return <div className="text-red-500">{error || 'Movie not found'}</div>
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <MovieHero
        title={movie.title}
        tagline={movie.tagline}
        backdropPath={movie.backdrop_path}
        releaseDate={movie.release_date}
        runtime={movie.runtime}
        voteAverage={movie.vote_average}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-300">{movie.overview}</p>

            <MovieActions
              movieId={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              isInWatchlist={isInWatchlist}
              isInWatched={isInWatched}
              onStatusChange={checkMovieStatus}
            />

            {movie.credits?.cast && <MovieCast cast={movie.credits.cast} />}
            {movie.videos?.results && <MovieTrailers videos={movie.videos.results} />}
          </div>

          <div>
            {movie.similar?.results && (
              <SimilarMovies 
                movies={movie.similar.results} 
                onMovieClick={handleSimilarMovieClick} 
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={handleAddReview}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded"
        >
          Add Review
        </button>
        
        <button
          onClick={handleWatchlistAction}
          className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded ml-2"
        >
          {/* Toggle text based on whether movie is in watchlist */}
          Add to Watchlist
        </button>
        
        {/* Show reviews section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Reviews</h2>
          {/* List of reviews */}
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsPage 