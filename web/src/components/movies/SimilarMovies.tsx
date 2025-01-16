import { Movie } from '../../types/movie'

type SimilarMoviesProps = {
  movies: Movie[]
  onMovieClick: (movieId: number) => void
}

const SimilarMovies = ({ movies, onMovieClick }: SimilarMoviesProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
      <div className="space-y-4">
        {movies.slice(0, 5).map(movie => (
          <div 
            key={movie.id} 
            className="flex space-x-4 cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors duration-200"
            onClick={() => onMovieClick(movie.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
              alt={movie.title}
              className="w-16 h-24 rounded object-cover"
            />
            <div>
              <h3 className="font-medium hover:text-accent">{movie.title}</h3>
              <p className="text-accent">★ {movie.vote_average.toFixed(1)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SimilarMovies 