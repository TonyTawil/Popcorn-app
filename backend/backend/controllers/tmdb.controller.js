import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getTrending = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.API_KEY}&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data from TMDB", error: error.message });
  }
};

export const getMoviesByType = async (req, res) => {
  const { type } = req.params;
  const page = req.query.page || 1;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${type}?api_key=${process.env.API_KEY}&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching ${type} movies from TMDB`,
      error: error.message,
    });
  }
};

export const getMovieCredits = async (req, res) => {
  const { movieId } = req.params;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching credits for movie ID ${movieId}`,
      error: error.message,
    });
  }
};

export const getSimilarMovies = async (req, res) => {
  const { movieId } = req.params;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${process.env.API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching similar movies for movie ID ${movieId}`,
      error: error.message,
    });
  }
};

export const getMovieById = async (req, res) => {
  const { movieId } = req.params;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching movie with ID ${movieId}`,
      error: error.message,
    });
  }
};

export const searchMovies = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${encodedQuery}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Error searching for movies",
      error: error.message,
    });
  }
};

export const getMovieVideos = async (req, res) => {
  const { movieId } = req.params;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.API_KEY}`
    );
    let filteredVideos = response.data.results.filter(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official === true &&
        video.name.toLowerCase().includes("official trailer")
    );

    // If no videos match the stricter criteria, fallback to less strict criteria
    if (filteredVideos.length === 0) {
      filteredVideos = response.data.results.filter(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.official === true
      );
    }

    res.json({ id: response.data.id, results: filteredVideos });
  } catch (error) {
    res.status(500).json({
      message: `Error fetching videos for movie ID ${movieId}`,
      error: error.message,
    });
  }
};
