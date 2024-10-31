import User from "../models/user.model.js";

export const addToWatchlist = async (req, res) => {
  const { userId, movieId, title, coverImage } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMovieInWatchlist = user.watchList.some(
      (movie) => movie.movieId === movieId
    );
    if (isMovieInWatchlist) {
      return res.status(409).send({ message: "Movie already in watchlist" });
    }

    user.watchList.push({ movieId, title, coverImage });
    await user.save();

    res
      .status(201)
      .send({ message: "Movie added to watchlist", watchList: user.watchList });
  } catch (error) {
    res.status(500).send({
      message: "Error adding movie to watchlist",
      error: error.message,
    });
  }
};

export const removeFromWatchlist = async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const updatedWatchList = user.watchList.filter(
      (movie) => movie.movieId !== movieId
    );
    user.watchList = updatedWatchList;
    await user.save();

    res.status(200).send({
      message: "Movie removed from watchlist",
      watchList: user.watchList,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error removing movie from watchlist",
      error: error.message,
    });
  }
};

export const addToWatched = async (req, res) => {
  const { userId, movieId, title, coverImage } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMovieInWatched = user.watched.some(
      (movie) => movie.movieId === movieId
    );
    if (isMovieInWatched) {
      return res.status(409).send({ message: "Movie already in watched list" });
    }

    user.watched.push({ movieId, title, coverImage });

    user.watchList = user.watchList.filter(
      (movie) => movie.movieId !== movieId
    );

    await user.save();

    res.status(201).send({
      message:
        "Movie added to watched list and removed from watchlist if present",
      watched: user.watched,
      watchList: user.watchList,
    });
  } catch (error) {
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
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ watchList: user.watchList });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching watchlist", error: error.message });
  }
};

export const getWatched = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ watched: user.watched });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching watched list", error: error.message });
  }
};
