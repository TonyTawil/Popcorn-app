import User from "../models/user.model.js";
import mongoose from 'mongoose';

export const addToWatchlist = async (req, res) => {
  try {
    const { movieId, title, coverImage } = req.body;
    // Get userId from the authenticated user in req.user
    const userId = req.user._id;

    console.log('Add to watchlist request:', { userId, movieId, title });

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid userId format:', userId);
      return res.status(400).send({ 
        message: "Invalid user ID format",
        error: "The provided user ID is not valid" 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).send({ message: "User not found" });
    }

    console.log('Current watchlist:', user.watchList);
    const isMovieInWatchlist = user.watchList.some(
      (movie) => movie.movieId === movieId
    );

    if (isMovieInWatchlist) {
      console.log('Movie already in watchlist:', movieId);
      return res.status(409).send({ message: "Movie already in watchlist" });
    }

    user.watchList.push({ movieId, title, coverImage });
    const savedUser = await user.save();
    console.log('Updated watchlist:', savedUser.watchList);

    res.status(201).send({ 
      message: "Movie added to watchlist", 
      watchList: savedUser.watchList 
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).send({
      message: "Error adding movie to watchlist",
      error: error.message,
    });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    console.log('Remove from watchlist request:', { userId, movieId });

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).send({ message: "User not found" });
    }

    console.log('Current watchlist:', user.watchList);
    const updatedWatchList = user.watchList.filter(
      (movie) => movie.movieId !== movieId
    );
    user.watchList = updatedWatchList;
    const savedUser = await user.save();
    console.log('Updated watchlist:', savedUser.watchList);

    res.status(200).send({
      message: "Movie removed from watchlist",
      watchList: savedUser.watchList,
    });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).send({
      message: "Error removing movie from watchlist",
      error: error.message,
    });
  }
};

export const addToWatched = async (req, res) => {
  try {
    const { userId, movieId, title, coverImage } = req.body;
    console.log('Add to watched request:', { userId, movieId, title });

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).send({ message: "User not found" });
    }

    console.log('Current watched list:', user.watched);
    const isMovieInWatched = user.watched.some(
      (movie) => movie.movieId === movieId
    );

    if (isMovieInWatched) {
      console.log('Movie already in watched list:', movieId);
      return res.status(409).send({ message: "Movie already in watched list" });
    }

    user.watched.push({ movieId, title, coverImage });
    user.watchList = user.watchList.filter(
      (movie) => movie.movieId !== movieId
    );

    const savedUser = await user.save();
    console.log('Updated watched list:', savedUser.watched);
    console.log('Updated watchlist:', savedUser.watchList);

    res.status(201).send({
      message: "Movie added to watched list and removed from watchlist if present",
      watched: savedUser.watched,
      watchList: savedUser.watchList,
    });
  } catch (error) {
    console.error('Add to watched error:', error);
    res.status(500).send({
      message: "Error adding movie to watched list",
      error: error.message,
    });
  }
};

export const removeFromWatched = async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const updatedWatched = user.watched.filter(
      (movie) => movie.movieId !== movieId
    );
    user.watched = updatedWatched;
    await user.save();

    res.status(200).send({
      message: "Movie removed from watched list",
      watched: user.watched,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error removing movie from watched list",
      error: error.message,
    });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Get watchlist request for user:', userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).send({ message: "User not found" });
    }

    console.log('Returning watchlist:', user.watchList);
    res.status(200).send({ watchList: user.watchList });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).send({ 
      message: "Error fetching watchlist", 
      error: error.message 
    });
  }
};

export const getWatched = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Get watched list request for user:', userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).send({ message: "User not found" });
    }

    console.log('Returning watched list:', user.watched);
    res.status(200).send({ watched: user.watched });
  } catch (error) {
    console.error('Get watched list error:', error);
    res.status(500).send({ 
      message: "Error fetching watched list", 
      error: error.message 
    });
  }
};
