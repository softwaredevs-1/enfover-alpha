import express from "express";
import { getAllNews, createNews, deleteNews, updateNews, softDeleteNews, getActiveNews } from "../controllers/news.controller.js";
import { adminOnly, studentOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, studentOnly, getAllNews); // For only Students (Subscribers) Fetch all news
router.get("/active", protect, studentOnly, getActiveNews); // For only Students (Subscribers) Fetch all news
router.post("/", protect, adminOnly, createNews); // Admin: Create a news article
router.delete("/:id", protect, adminOnly, softDeleteNews); // Admin: Delete a news article
router.put("/:id", protect, adminOnly, updateNews); // Admin: Delete a news article

export default router;
