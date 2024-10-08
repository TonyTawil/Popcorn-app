import Review from "../models/review.model.js";

export const addReview = async (req, res) => {
  try {
    const { movieId, userId, rating, reviewText } = req.body;

    const existingRating = await Review.findOne({ movieId, userId, rating });
    if (existingRating) {
      if (reviewText) {
        existingRating.reviewText.push(reviewText);
        const updatedReview = await existingRating.save();
        return res.status(200).json(updatedReview);
      }
      return res
        .status(409)
        .json({ message: "User has already rated this movie." });
    }

    const newReview = new Review({
      movieId,
      userId,
      rating,
      reviewText,
    });

    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error: " + error.message });
    } else if (error.name === "MongoError" && error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Duplicate entry error: " + error.message });
    } else {
      return res
        .status(500)
        .json({ message: "Internal server error: " + error.message });
    }
  }
};
