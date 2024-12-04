import express from "express";
import {
  getCompetitions,
  getCompetitionsAdmin,
  createCompetition,
  deleteCompetition,
  submitAnswers,
  updateCompetition,
  getAdminAnalytics
} from "../controllers/competition.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// Admin: Create a competition
router.post("/", protect, adminOnly, createCompetition);

// Students: Submit answers
router.post("/submit", protect, submitAnswers);

// Students: Fetch competitions (limited view)
router.get("/", protect, getCompetitions);

// Admin: Fetch competitions (full view)
router.get("/admin", protect, adminOnly, getCompetitionsAdmin);

// Admin: Delete a competition
router.delete("/:id", protect, adminOnly, deleteCompetition);

// Admin: Update a competition
router.put("/:id", protect, adminOnly, updateCompetition);

//Admin: Get analytics data
router.get("/analytics", protect, adminOnly, getAdminAnalytics); // Admin: Get competition analytics



export default router;
