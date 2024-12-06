import express from "express";
import { getAllNews, createNews, getDeletedNews, updateNews, softDeleteNews, getActiveNews } from "../controllers/news.controller.js";
import { adminOnly, studentOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createNews); // Admin: Create a news article
router.get("/", protect, adminOnly, getAllNews); // For only Admins Fetch all news
router.get("/active", protect, getActiveNews); // For only Students (Subscribers) Fetch all news
router.get("/deleted", protect, getDeletedNews )
router.delete("/:id", protect, adminOnly, softDeleteNews); // Admin: Delete a news article
router.put("/:id", protect, adminOnly, updateNews); // Admin: Delete a news article

export default router;
