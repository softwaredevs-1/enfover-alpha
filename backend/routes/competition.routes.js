import express from "express";
import {
  getCompetitions,
  getCompetitionsAdmin,
  createCompetition,
  deleteCompetition,
  submitAnswers,
  updateCompetition,
} from "../controllers/competition.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Students: Fetch competitions (limited view)
router.get("/", protect, getCompetitions);

// Admin: Fetch competitions (full view)
router.get("/admin", protect, adminOnly, getCompetitionsAdmin);

// Admin: Create a competition
router.post("/", protect, adminOnly, createCompetition);

// Admin: Delete a competition
router.delete("/:id", protect, adminOnly, deleteCompetition);

// Admin: Update a competition
router.put("/:id", protect, adminOnly, updateCompetition);

// Students: Submit answers
router.post("/submit", protect, submitAnswers);


export default router;
