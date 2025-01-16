import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  isEmailVerified,
  getUserByEmail,
  resendVerification,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.get("/is-verified/:userId", isEmailVerified);
router.get("/user/email/:email", getUserByEmail);
router.post("/resend-verification", resendVerification);
router.get("/check", protect, checkAuth);

export default router;
