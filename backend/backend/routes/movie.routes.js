import express from "express";
import {
  addToWatchlist,
  removeFromWatchlist,
  addToWatched,
  removeFromWatched,
  getWatchlist,
} from "../controllers/movie.controller.js";

const router = express.Router();

router.post("/add-to-watchlist", addToWatchlist);

router.post("/remove-from-watchlist", removeFromWatchlist);

router.post("/add-to-watched", addToWatched);

router.post("/remove-from-watched", removeFromWatched);

router.post("/get-watchlist", getWatchlist);

export default router;
