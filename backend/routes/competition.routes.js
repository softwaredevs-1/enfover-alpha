import express from "express";
import {
  getCompetitions,
  getCompetitionsAdmin,
  createCompetition,
  deleteCompetition,
  submitAnswers,
  updateCompetition
} from "../controllers/competition.controller.js";
import { protect, competitionAdminOnly } from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/getAdminAnalytics.controller.js";

const router = express.Router();


// Admin: Create a competition
router.post("/", protect, competitionAdminOnly, createCompetition);

// Students: Submit answers
router.post("/submit", protect, submitAnswers);



// *********************************************
// Students: Fetch competitions (limited view)
router.get("/", protect, getCompetitions);
// **************************************************

// Admin: Fetch competitions (full view)
router.get("/admin", protect, competitionAdminOnly, getCompetitionsAdmin);

// Admin: Delete a competition
router.delete("/:id", protect, competitionAdminOnly, deleteCompetition);

// Admin: Update a competition
router.put("/:id", protect, competitionAdminOnly, updateCompetition);

//Admin: Get analytics data
router.get("/analytics", protect, competitionAdminOnly, getAdminAnalytics); // Admin: Get competition analytics



export default router;
