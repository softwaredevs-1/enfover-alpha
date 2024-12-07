import express from "express";
import {
  registerUser, loginUser, getUserProfile,
logoutUser,
  updateUserProfile,
  getAllUsers,
  updateActivityStatus,
  updateSubscriptionStatus,
  getBlockedUsers,
  getSubscribedUsers,
  getUnsubscribedUsers,
} from "../controllers/user.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser); // User registration
router.post("/login", loginUser);       // User login
router.post("/logout", logoutUser);    // User logout
router.put("/profile", protect, updateUserProfile); // Update user profile (protected)
router.get("/profile", protect, getUserProfile); // Get user profile (protected)
router.get("/", protect, adminOnly, getAllUsers); // Admin: Get list of all registered users

// Admin: Update activity status
router.put("/activity-status/:id", protect, adminOnly, updateActivityStatus);

// Student: Update subscription status
router.put("/subscription-status", protect, updateSubscriptionStatus);

// Admin: Get blocked users
router.get("/blocked", protect, adminOnly, getBlockedUsers);

// Admin: Get subscribed users
router.get("/subscribed", protect, adminOnly, getSubscribedUsers);

// Admin: Get unsubscribed users
router.get("/unsubscribed", protect, adminOnly, getUnsubscribedUsers);




export default router;
