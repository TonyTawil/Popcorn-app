const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

type ApiError = {
  message: string
  status?: number
}

export const fetchMovies = async (endpoint: string, page: number = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tmdb${endpoint}?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const error: ApiError = {
        message: 'Failed to fetch movies',
        status: response.status
      }
      throw error
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error instanceof Error ? error : new Error('An unknown error occurred');
  }
}; 

export const fetchMovieDetails = async (movieId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tmdb/movie/${movieId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to fetch movie details')
    return await response.json()
  } catch (error) {
    console.error('Error fetching movie details:', error)
    throw error
  }
}

export const fetchMovieCredits = async (movieId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tmdb/credits/${movieId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to fetch movie credits')
    return await response.json()
  } catch (error) {
    console.error('Error fetching movie credits:', error)
    throw error
  }
}

export const fetchSimilarMovies = async (movieId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tmdb/similar/${movieId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to fetch similar movies')
    return await response.json()
  } catch (error) {
    console.error('Error fetching similar movies:', error)
    throw error
  }
}

export const fetchMovieVideos = async (movieId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tmdb/movie/${movieId}/videos`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to fetch movie videos')
    return await response.json()
  } catch (error) {
    console.error('Error fetching movie videos:', error)
    throw error
  }
} 

type MovieListItem = {
  movieId: number
  title: string
  coverImage: string
}

export const addToWatchlist = async (movie: MovieListItem) => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/add-to-watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: 'current-user-id', // You'll need to get this from your auth context
        ...movie
      })
    })
    if (!response.ok) throw new Error('Failed to add to watchlist')
    return await response.json()
  } catch (error) {
    console.error('Error adding to watchlist:', error)
    throw error
  }
}

export const removeFromWatchlist = async (movieId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/remove-from-watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: 'current-user-id', // You'll need to get this from your auth context
        movieId
      })
    })
    if (!response.ok) throw new Error('Failed to remove from watchlist')
    return await response.json()
  } catch (error) {
    console.error('Error removing from watchlist:', error)
    throw error
  }
}

export const addToWatched = async (movie: MovieListItem) => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/add-to-watched`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: 'current-user-id', // You'll need to get this from your auth context
        ...movie
      })
    })
    if (!response.ok) throw new Error('Failed to add to watched')
    return await response.json()
  } catch (error) {
    console.error('Error adding to watched:', error)
    throw error
  }
}

export const removeFromWatched = async (movieId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/remove-from-watched`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: 'current-user-id', // You'll need to get this from your auth context
        movieId
      })
    })
    if (!response.ok) throw new Error('Failed to remove from watched')
    return await response.json()
  } catch (error) {
    console.error('Error removing from watched:', error)
    throw error
  }
}

export const getWatchlist = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/get-watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: 'current-user-id' // You'll need to get this from your auth context
      })
    })
    if (!response.ok) throw new Error('Failed to fetch watchlist')
    return await response.json()
  } catch (error) {
    console.error('Error fetching watchlist:', error)
    throw error
  }
}

export const getWatched = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/get-watched`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: 'current-user-id' // You'll need to get this from your auth context
      })
    })
    if (!response.ok) throw new Error('Failed to fetch watched list')
    return await response.json()
  } catch (error) {
    console.error('Error fetching watched list:', error)
    throw error
  }
} 

type LoginData = {
  username: string
  password: string
}

type SignupData = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  gender: string
  isGoogleAccount?: boolean
}

export const login = async (data: LoginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to login')
    }

    return await response.json()
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const signup = async (data: SignupData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create account')
    }

    const userData = await response.json()
    return userData
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to logout')
    }

    return await response.json()
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
} 