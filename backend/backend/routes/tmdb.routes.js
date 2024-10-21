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
