import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  addToWatched,
  removeFromWatched,
  getWatched,
} from "../controllers/movie.controller.js";

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.post("/watchlist/add", addToWatchlist);
router.post("/watchlist/remove", removeFromWatchlist);
router.post("/watchlist", getWatchlist);
router.post("/watched/add", addToWatched);
router.post("/watched/remove", removeFromWatched);
router.post("/watched", getWatched);

export default router;
