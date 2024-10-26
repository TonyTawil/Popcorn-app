import Review from "../models/review.model.js";

export const addReview = async (req, res) => {
  try {
    const { movieId, userId, rating, reviewText } = req.body;

    const existingRating = await Review.findOne({ movieId, userId, rating });
    if (existingRating) {
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

    res.status(201).json({
      reviewId: savedReview._id,
      movieId: savedReview.movieId,
      userId: savedReview.userId,
      rating: savedReview.rating,
      reviewText: savedReview.reviewText,
    });
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

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review." });
    }

    await Review.deleteOne({ _id: reviewId });
    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId, rating, reviewText } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this review." });
    }

    review.rating = rating ?? review.rating;
    review.reviewText = reviewText ?? review.reviewText;

    const updatedReview = await review.save();
    res.status(200).json({
      reviewId: updatedReview._id,
      movieId: updatedReview.movieId,
      userId: updatedReview.userId,
      rating: updatedReview.rating,
      reviewText: updatedReview.reviewText,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const addReplyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId, replyText } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const newReply = {
      userId,
      replyText,
    };

    review.replies.push(newReply);
    await review.save();

    res.status(201).json({
      message: "Reply added successfully.",
      reviewId: review._id,
      replies: review.replies,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const editReplyToReview = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;
    const { userId, replyText } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const reply = review.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }

    if (reply.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this reply." });
    }

    reply.replyText = replyText;
    await review.save();

    res.status(200).json({
      message: "Reply updated successfully.",
      reviewId: review._id,
      replies: review.replies,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const deleteReplyToReview = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;
    const { userId } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const replyIndex = review.replies.findIndex(
      (reply) => reply.id === replyId && reply.userId.toString() === userId
    );

    if (replyIndex === -1) {
      return res.status(404).json({
        message: "Reply not found or unauthorized to delete this reply.",
      });
    }

    review.replies.splice(replyIndex, 1);

    await review.save();

    res.status(200).json({
      message: "Reply deleted successfully.",
      reviewId: review._id,
      replies: review.replies,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.likes.includes(userId)) {
      return res
        .status(409)
        .json({ message: "User has already liked this review." });
    }

    review.likes.push(userId);
    review.likesCount = review.likes.length;

    await review.save();

    res.status(200).json({
      message: "Review liked successfully.",
      reviewId: review._id,
      likesCount: review.likesCount,
      likes: review.likes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const likeReply = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;
    const { userId } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const reply = review.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }

    if (reply.likes.includes(userId)) {
      return res
        .status(409)
        .json({ message: "User has already liked this reply." });
    }

    reply.likes.push(userId);
    reply.likesCount = reply.likes.length;

    await review.save();

    res.status(200).json({
      message: "Reply liked successfully.",
      reviewId: review._id,
      replyId: reply._id,
      likesCount: reply.likesCount,
      likes: reply.likes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const unlikeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const index = review.likes.indexOf(userId);
    if (index === -1) {
      return res
        .status(409)
        .json({ message: "User has not liked this review." });
    }

    review.likes.splice(index, 1);
    review.likesCount = review.likes.length;

    await review.save();

    res.status(200).json({
      message: "Review unliked successfully.",
      reviewId: review._id,
      likesCount: review.likesCount,
      likes: review.likes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const unlikeReply = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;
    const { userId } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const reply = review.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }

    const index = reply.likes.indexOf(userId);
    if (index === -1) {
      return res
        .status(409)
        .json({ message: "User has not liked this reply." });
    }

    reply.likes.splice(index, 1);
    reply.likesCount = reply.likes.length;

    await review.save();

    res.status(200).json({
      message: "Reply unliked successfully.",
      reviewId: review._id,
      replyId: reply._id,
      likesCount: reply.likesCount,
      likes: reply.likes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const getReviewsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId }).populate(
      "userId",
      "username"
    );
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};
