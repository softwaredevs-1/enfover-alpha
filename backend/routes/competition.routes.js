import express from "express";
import {
  getCompetitions,
  getCompetitionStud,
  getCompetitionContent,
  getCompetitionsAdmin,
  createCompetition,
  deleteCompetition,
  submitAnswers,
  updateCompetition,
} from "../controllers/competition.controller.js";
import { protect, competitionAdminOnly, subscribedStudentOrVerifiedCompetitionAdmin } from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/getAdminAnalytics.controller.js";

const router = express.Router();

// Admin: Create a competition
router.post("/", protect, competitionAdminOnly, createCompetition);

// Students: Submit answers for competitions
router.post("/submit", protect, subscribedStudentOrVerifiedCompetitionAdmin, submitAnswers);

// Fetch active competitions (accessible by students and competition admins)
router.get("/active", protect, subscribedStudentOrVerifiedCompetitionAdmin, getCompetitionStud);

// Fetch the content of the competiton for Student and admin (subscribed)
router.get("/content/:id", protect, subscribedStudentOrVerifiedCompetitionAdmin, getCompetitionContent);

// Fetch active competitions (accessible by students and competition admins)
router.get("/", protect, competitionAdminOnly, getCompetitionStud);

// Admin: Fetch all competitions (full view)
router.get("/admin", protect, competitionAdminOnly, getCompetitionsAdmin);

// Admin: Update a competition
router.put("/:id", protect, competitionAdminOnly, updateCompetition);

// Admin: Delete a competition
router.delete("/:id", protect, competitionAdminOnly, deleteCompetition);

// Admin: Get analytics data for competitions
router.get("/analytics", protect, competitionAdminOnly, getAdminAnalytics);

export default router;
