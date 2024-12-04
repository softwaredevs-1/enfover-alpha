import express from "express";
import { getCoursesByGrade, addCourseContent, getCourseContent, getAllCourses, updateCourse, softDeleteCourse } from "../controllers/course.controller.js";
import { teacherOnly, protect, adminOnly, adminOrCreatorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, teacherOnly, addCourseContent); // Teacher: Add course content
router.put("/:id", protect, teacherOnly, updateCourse); // Teacher: Update course content
router.delete("/:id", protect, adminOrCreatorOnly, softDeleteCourse)
router.get("/", protect, adminOnly, getAllCourses)
router.get("/:grade", protect, getCoursesByGrade); // Get courses for a specific grade
router.get("/content/:id", protect, getCourseContent); // Get specific course content by ID

export default router;