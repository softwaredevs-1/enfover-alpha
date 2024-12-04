import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  updateUserProfile,
  getAllUsers,
} from "../controllers/user.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser); // User registration
router.post("/login", loginUser);       // User login
router.post("/logout", logoutUser);    // User logout
router.put("/profile", protect, updateUserProfile); // Update user profile (protected)
router.get("/profile", protect, getUserProfile); // Get user profile (protected)
router.get("/", protect,adminOnly, getAllUsers); // Admin: Get list of all registered users

export default router;
