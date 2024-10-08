import express from "express";
import { addReview } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/add-review", addReview);

export default router;
