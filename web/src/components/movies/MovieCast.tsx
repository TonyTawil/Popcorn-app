type CastMember = {
  id: number
  name: string
  character: string
  profile_path: string | null
}

type MovieCastProps = {
  cast: CastMember[]
}

const MovieCast = ({ cast }: MovieCastProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cast.slice(0, 8).map(actor => (
          <div key={actor.id} className="text-center">
            <img
              src={actor.profile_path 
                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                : '/placeholder-actor.png'}
              alt={actor.name}
              className="w-full rounded-lg"
            />
            <p className="font-medium mt-2">{actor.name}</p>
            <p className="text-sm text-gray-400">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MovieCast 