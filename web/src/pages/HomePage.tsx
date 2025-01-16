import { useEffect } from 'react'
import MovieSection from '../components/movies/MovieSection'
import { useMovies } from '../hooks/useMovies'

const HomePage = () => {
  const { 
    trending, 
    nowPlaying, 
    upcoming, 
    setTrending,
    setNowPlaying,
    setUpcoming,
    fetchMovieSection 
  } = useMovies()

  useEffect(() => {
    fetchMovieSection('/movie/trending', setTrending)
    fetchMovieSection('/type/now_playing', setNowPlaying)
    fetchMovieSection('/type/upcoming', setUpcoming)
  }, [fetchMovieSection, setTrending, setNowPlaying, setUpcoming])

  return (
    <main className="max-w-7xl mx-auto pt-6">
      <MovieSection
        title="Trending"
        movies={trending.data}
        isLoading={trending.isLoading}
        error={trending.error}
        category="trending"
        onShowMore={() => fetchMovieSection('/movie/trending', setTrending, trending.page + 1)}
      />
      <MovieSection
        title="Now Playing"
        movies={nowPlaying.data}
        isLoading={nowPlaying.isLoading}
        error={nowPlaying.error}
        category="now_playing"
        onShowMore={() => fetchMovieSection('/type/now_playing', setNowPlaying, nowPlaying.page + 1)}
      />
      <MovieSection
        title="Upcoming"
        movies={upcoming.data}
        isLoading={upcoming.isLoading}
        error={upcoming.error}
        category="upcoming"
        onShowMore={() => fetchMovieSection('/type/upcoming', setUpcoming, upcoming.page + 1)}
      />
    </main>
  )
}

export default HomePage 