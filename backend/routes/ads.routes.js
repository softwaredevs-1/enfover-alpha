import express from "express";
import {
  createAd,
  getActiveAds,
  deleteAd,
} from "../controllers/ads.controller.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getActiveAds) // Public route to fetch active ads
  .post(protect, adminOnly, createAd); // Admin-only route to create ads

router.route("/:id")
  .delete(protect, adminOnly, deleteAd); // Admin-only route to delete ads

export default router;
