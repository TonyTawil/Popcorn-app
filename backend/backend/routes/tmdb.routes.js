// https://api.themoviedb.org/3/trending/movie/day?api_key=[API_KEY]&page=[PAGE_NUMBER]
// https://api.themoviedb.org/3/movie/[MOVIE_TYPE]?api_key=[API_KEY]&page=[PAGE_NUMBER]
// https://api.themoviedb.org/3/movie/[MOVIE_ID]/credits?api_key=[API_KEY]
// https://api.themoviedb.org/3/trending/movie/day?api_key=key&page=number
// https://api.themoviedb.org/3/movie/now_playing?api_key=key&page=number
// https://api.themoviedb.org/3/movie/upcoming?api_key=key&page=number
// https://api.themoviedb.org/3/movie/{MOVIE_ID}/credits?api_key=key

import express from "express";
import {
  getTrending,
  getMoviesByType,
  getMovieCredits,
} from "../controllers/tmdb.controller.js";

const router = express.Router();

router.get("/trending", getTrending);
router.get("/movie/:type", getMoviesByType);
router.get("/movie/:movieId/credits", getMovieCredits);

export default router;
