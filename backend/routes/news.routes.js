import express from "express";
import { getAllNews, createNews, deleteNews } from "../controllers/news.controller.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllNews); // Fetch all news
router.post("/", protect, adminOnly, createNews); // Admin: Create a news article
router.delete("/:id", protect, adminOnly, deleteNews); // Admin: Delete a news article

export default router;
