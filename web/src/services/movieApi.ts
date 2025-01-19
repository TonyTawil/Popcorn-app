interface AddToWatchlistParams {
  movieId: string
  title: string
  coverImage: string
}

export const addToWatchlist = async ({ movieId, title, coverImage }: AddToWatchlistParams) => {
  const response = await fetch('/api/movies/watchlist/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      movieId, 
      title, 
      coverImage 
    }),
    credentials: 'include'
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to add movie to watchlist')
  }

  return response.json()
}

export const removeFromWatchlist = async (movieId: string) => {
  const response = await fetch('/api/movies/watchlist/remove', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ movieId }),
    credentials: 'include'
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to remove movie from watchlist')
  }

  return response.json()
}

export const getWatchlist = async () => {
  const response = await fetch('/api/movies/watchlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch watchlist')
  }

  return response.json()
} 