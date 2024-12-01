import express from "express";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser); // User registration
router.post("/login", loginUser);       // User login
router.post("/logout", logoutUser )
router.get("/profile", protect, getUserProfile); // Get user profile (protected)

export default router;
