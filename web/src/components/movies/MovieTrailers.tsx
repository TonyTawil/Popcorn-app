type Video = {
  id: string
  key: string
  name: string
  site: string
  type: string
}

type MovieTrailersProps = {
  videos: Video[]
}

const MovieTrailers = ({ videos }: MovieTrailersProps) => {
  const trailers = videos
    .filter(video => video.site === 'YouTube' && video.type === 'Trailer')
    .slice(0, 2)

  if (trailers.length === 0) return null

  return (
    <>
      <h2 className="text-2xl font-bold mt-8 mb-4">Trailers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trailers.map(video => (
          <div key={video.id} className="aspect-w-16 aspect-h-9">
            <iframe
              src={`https://www.youtube.com/embed/${video.key}`}
              title={video.name}
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default MovieTrailers 