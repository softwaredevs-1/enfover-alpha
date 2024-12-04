import express from "express";
import {
  createAd,
  getActiveAds,
  getDeletedAds,
  editAd,
  softDeleteAd,
  getScheduledAds
} from "../controllers/ads.controller.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/getAdminAnalytics.controller.js";
import { upload } from "../utils/fileUpload.js"; // Import Multer

const router = express.Router();

router.route("/")
.get(getActiveAds) // Public route to fetch active ads  
.post(protect, adminOnly, upload.single("file"),createAd); // Admin-only route to create ads

router.route("/scheduled")
  .get(protect, adminOnly, getScheduledAds); // Admin: Get scheduled ads

router.route("/deleted").get(protect, adminOnly, getDeletedAds) // Public route to fetch deleted ads 


router.get("/analytics", protect, adminOnly, getAdminAnalytics); // Admin: Get competition analytics

router.route("/:id")
  .put(protect, adminOnly, editAd) // Admin-only route to edit an ad
  .delete(protect, adminOnly, softDeleteAd); // Admin-only route to delete ads

export default router;
