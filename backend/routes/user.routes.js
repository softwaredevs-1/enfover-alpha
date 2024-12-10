import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  updateUserProfile,
  getAllUsers,
  updateActivityStatus,
  updateSubscriptionStatus,
  getActiveUsers,
  getActiveStudents,
  getActiveTeachers,
  getBlockedUsers,
  getSubscribedUsers,
  getUnsubscribedUsers,
  verifyUser,
  getVerifiedTeacher,
  getVerifiedAdmin,
  getPendingUser,
  getRejectedUser,

} from "../controllers/user.controller.js";
import {
  adminOnly,
  superAdminOnly,
  verifiedOnly,
  protect,
  userAdminOnly,
  studentOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser); // User registration
router.post("/login", loginUser); // User login
router.post("/logout", logoutUser); // User logout

// Protected routes
router.put("/profile", protect, updateUserProfile); // Edit user profile
router.get("/profile", protect, getUserProfile); // Get user profile

// Admin routes
router.get("/", protect, adminOnly, verifiedOnly, getAllUsers); // Admin: Get all users

router.put( "/activity-status/:id",protect, adminOnly ,verifiedOnly, updateActivityStatus); // Super Admin: Update user activity status
router.get("/active-students", protect, adminOnly, verifiedOnly, getActiveStudents); // Admin: Get active students
router.get("/active-teachers", protect, adminOnly, verifiedOnly, getActiveTeachers); // Admin: Get active teachers

// General user status routes
router.get("/active", protect, adminOnly, getActiveUsers); // Admin: Get active users
router.get("/blocked", protect, adminOnly, getBlockedUsers); // Admin: Get blocked users

// Subscription routes (Students only)
router.put("/subscription-status", protect, studentOnly, updateSubscriptionStatus);
router.get("/subscribed", protect, adminOnly, getSubscribedUsers); // Admin: Get subscribed users
router.get("/unsubscribed", protect, adminOnly, getUnsubscribedUsers); // Admin: Get unsubscribed users

// Super Admin routes
router.put("/verify/:id", protect, superAdminOnly, verifyUser); // Super Admin: Verify pending users
router.get("/verified-teachers", protect, adminOnly, getVerifiedTeacher); // Super Admin: Get all verified teachers
router.get("/verified-admins", protect, superAdminOnly, getVerifiedAdmin); // Super Admin: Get all verified admins
router.get("/pending", protect, adminOnly, getPendingUser)
router.get("/rejected", protect, adminOnly, getRejectedUser)


export default router;
