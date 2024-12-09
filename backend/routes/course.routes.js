import express from "express";
import { getCoursesByGrade, addCourseContent, getCourseContent, getAllCourses, updateCourse, softDeleteCourse } from "../controllers/course.controller.js";
import { teacherOnly, protect, adminOnly, adminOrCreatorOnly, coursesAdminOnly, studentOnly, subscribedStudentOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, teacherOnly, addCourseContent); // Teacher Add course content
router.put("/:id", protect, adminOrCreatorOnly,coursesAdminOnly, updateCourse); // Teacher and courseAdmin Update course content
router.delete("/:id", protect, adminOrCreatorOnly, coursesAdminOnly, softDeleteCourse) //teacher and courseAdmin
router.get("/", protect, coursesAdminOnly, getAllCourses) // 
router.get("/:grade", protect, studentOnly, coursesAdminOnly, getCoursesByGrade); // Get courses for a specific grade
router.get("/content/:id", protect, subscribedStudentOnly, coursesAdminOnly, getCourseContent); // Get specific course content by ID : for subscribed users

export default router;