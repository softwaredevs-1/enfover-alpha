import express from "express";
import { getCompetitions, createCompetition, deleteCompetition } from "../controllers/competition.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCompetitions); // Fetch all competitions
router.post("/", protect, adminOnly, createCompetition); // Admin: Create a competition
router.delete("/:id", protect, adminOnly, deleteCompetition); // Admin: Delete a competition

export default router;
