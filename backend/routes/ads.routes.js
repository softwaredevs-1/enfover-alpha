import express from "express";
import {createAd, getActiveAds, getDeletedAds, editAd, softDeleteAd, getScheduledAds, getExpiredAds } from "../controllers/ads.controller.js";
import { protect, adsAdminOnly } from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/getAdminAnalytics.controller.js";
import { upload } from "../utils/fileUpload.js"; // Multer for file uploads

const router = express.Router();
// Routes for ads management

// Public route to fetch active ads
router.route("/")
  .get(getActiveAds)
  .post(protect, adsAdminOnly, upload.single("file"), createAd); // Admin-only route to create ads

// Admin-only route to fetch scheduled ads
router.route("/scheduled")
  .get(protect, adsAdminOnly, getScheduledAds);

// Admin-only route to fetch soft-deleted ads
router.route("/deleted")
  .get(protect, adsAdminOnly, getDeletedAds);

// Admin-only route to fetch analytics for ads
router.get("/analytics", protect, adsAdminOnly, getAdminAnalytics);

router.get("/expired", protect, adsAdminOnly, getExpiredAds)

// Routes for specific ads (by ID)
router.route("/:id")
  .put(protect, adsAdminOnly, editAd) // Admin-only route to edit an ad
  .delete(protect, adsAdminOnly, softDeleteAd); // Admin-only route to soft delete ads

export default router;