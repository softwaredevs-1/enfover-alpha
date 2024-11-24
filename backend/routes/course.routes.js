import express from "express";
import { getCoursesByGrade, addCourseContent, getCourseContent } from "../controllers/course.controller.js";
import { teacherOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:grade", protect, getCoursesByGrade); // Get courses for a specific grade
router.post("/", protect, teacherOnly, addCourseContent); // Teacher: Add course content
router.get("/content/:id", protect, getCourseContent); // Get specific course content by ID

export default router;
