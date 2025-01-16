import { useState } from 'react';
import { Movie } from '../../types/movie';
import { useNavigate } from 'react-router-dom';

type MovieSectionProps = {
  title: string;
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  category: string;
  onShowMore: () => void;
}

const MovieSection = ({ 
  title, 
  movies, 
  isLoading, 
  error, 
  category,
}: MovieSectionProps) => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (error) {
    return (
      <section className="py-8">
        <h2 className="text-4xl font-bold text-white px-4 mb-6">{title}</h2>
        <div className="text-red-500 px-4">{error}</div>
      </section>
    );
  }

  const handleViewDetails = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <section className="py-8">
      <div className="flex justify-between items-center px-4 mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button
          onClick={() => navigate(`/movies/${category}`)}
          className="text-primary hover:text-accent transition-colors"
        >
          See all
        </button>
      </div>
      
      <div className="relative">
        <div className="flex overflow-x-auto space-x-4 px-4 pb-4 scrollbar-hide">
          {isLoading ? (
            // Loading skeletons
            [...Array(5)].map((_, index) => (
              <div key={index} className="flex-none w-32 md:w-48 animate-pulse">
                <div className="bg-gray-700 w-full h-48 md:h-72 rounded-lg"></div>
                <div className="bg-gray-700 h-4 w-3/4 mt-2 rounded"></div>
              </div>
            ))
          ) : (
            movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-none w-32 md:w-48 transition-transform duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredId(movie.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-48 md:h-72 object-cover rounded-lg shadow-lg"
                    loading="lazy"
                  />
                  {hoveredId === movie.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="text-accent text-lg font-bold mb-2">
                          ★ {movie.vote_average.toFixed(1)}
                        </div>
                        <button 
                          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm"
                          onClick={() => handleViewDetails(movie.id)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="text-white mt-2 text-sm font-medium truncate">
                  {movie.title}
                </h3>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MovieSection; 