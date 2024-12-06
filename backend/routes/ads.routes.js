import express from "express";
import {
  createAd,
  getActiveAds,
  getDeletedAds,
  editAd,
  softDeleteAd,
  getScheduledAds,
  getExpiredAds
} from "../controllers/ads.controller.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/getAdminAnalytics.controller.js";
import { upload } from "../utils/fileUpload.js"; // Multer for file uploads

const router = express.Router();

// Routes for ads management

// Public route to fetch active ads
router.route("/")
  .get(getActiveAds)
  .post(protect, adminOnly, upload.single("file"), createAd); // Admin-only route to create ads

// Admin-only route to fetch scheduled ads
router.route("/scheduled")
  .get(protect, adminOnly, getScheduledAds);

// Admin-only route to fetch soft-deleted ads
router.route("/deleted")
  .get(protect, adminOnly, getDeletedAds);

// Admin-only route to fetch analytics for ads
router.get("/analytics", protect, adminOnly, getAdminAnalytics);

router.get("/expired", protect, adminOnly, getExpiredAds)

// Routes for specific ads (by ID)
router.route("/:id")
  .put(protect, adminOnly, editAd) // Admin-only route to edit an ad
  .delete(protect, adminOnly, softDeleteAd); // Admin-only route to soft delete ads

export default router;
