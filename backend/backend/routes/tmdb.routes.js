import express from "express";
import {
  getTrending,
  getMoviesByType,
  getMovieCredits,
  getSimilarMovies,
} from "../controllers/tmdb.controller.js";

const router = express.Router();

router.get("/movie/trending", getTrending);
router.get("/:type", getMoviesByType);
router.get("/credits/:movieId", getMovieCredits);
router.get("/similar/:movieId", getSimilarMovies);

export default router;
