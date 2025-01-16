export type Movie = {
  id: number
  title: string
  poster_path: string
  vote_average: number
}

export type MovieDetails = Movie & {
  overview: string
  release_date: string
  runtime: number
  genres: Array<{ id: number; name: string }>
  backdrop_path: string
  tagline: string
  status: string
  credits?: {
    cast: Array<{
      id: number
      name: string
      character: string
      profile_path: string | null
    }>
  }
  similar?: {
    results: Movie[]
  }
  videos?: {
    results: Array<{
      id: string
      key: string
      name: string
      site: string
      type: string
    }>
  }
}

export type MovieSectionState = {
  data: Movie[]
  isLoading: boolean
  error: string | null
  page: number
} 