import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  isEmailVerified,
  getUserByEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.get("/is-verified/:userId", isEmailVerified);
router.get("/user/email/:email", getUserByEmail);

export default router;
