type MovieHeroProps = {
  title: string
  tagline: string
  backdropPath: string
  releaseDate: string
  runtime: number
  voteAverage: number
}

const MovieHero = ({ 
  title, 
  tagline, 
  backdropPath, 
  releaseDate, 
  runtime, 
  voteAverage 
}: MovieHeroProps) => {
  return (
    <div 
      className="relative h-[50vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${backdropPath})`
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute bottom-0 p-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-lg mt-2">{tagline}</p>
        <div className="flex items-center mt-4 space-x-4">
          <span className="text-accent">★ {voteAverage.toFixed(1)}</span>
          <span>{releaseDate.split('-')[0]}</span>
          <span>{Math.floor(runtime / 60)}h {runtime % 60}m</span>
        </div>
      </div>
    </div>
  )
}

export default MovieHero 