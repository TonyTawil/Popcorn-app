import express from "express";
import {
  addReview,
  deleteReview,
  updateReview,
  addReplyToReview,
  editReplyToReview,
  deleteReplyToReview,
  likeReview,
  likeReply,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/add-review", addReview);

router.delete("/:reviewId", deleteReview);

router.put("/:reviewId", updateReview);

router.post("/:reviewId/reply", addReplyToReview);

router.put("/:reviewId/reply/:replyId", editReplyToReview);

router.delete("/:reviewId/reply/:replyId", deleteReplyToReview);

router.post("/:reviewId/like", likeReview);

router.post("/:reviewId/reply/:replyId/like", likeReply);

export default router;
