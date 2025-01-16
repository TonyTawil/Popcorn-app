import { Movie } from '../../types/movie'

type MovieGridProps = {
  movies: Movie[]
  onMovieClick: (movieId: number) => void
}

const MovieGrid = ({ movies, onMovieClick }: MovieGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => onMovieClick(movie.id)}
        >
          <div className="relative aspect-[2/3]">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              loading="lazy"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded">
              <span className="text-accent">★ {movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
          <h3 className="mt-2 text-sm font-medium truncate">{movie.title}</h3>
        </div>
      ))}
    </div>
  )
}

export default MovieGrid 