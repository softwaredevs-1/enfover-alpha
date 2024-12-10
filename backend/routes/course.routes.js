import express from "express";
import {
  getCoursesByGrade,
  addCourseContent,
  getCourseContent,
  getAllCourses,
  getActiveCourses,
  getDeletedCourses,
  updateCourse,
  softDeleteCourse,
} from "../controllers/course.controller.js";
import {
  protect,
  adminOrCreatorOnly,
  coursesAdminOnly,
  subscribedStudentOnly,
  verifiedActiveTeacherOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Route: Add course content
// Access: Verified and active teachers only
router.post("/", protect, verifiedActiveTeacherOnly, addCourseContent);

// Route: Update course content
// Access: Admins or course creators (teacher) who are verified and active
router.put("/:id", protect, adminOrCreatorOnly, coursesAdminOnly, updateCourse);

// Route: Soft delete course content
// Access: Admins or course creators (teacher) who are verified and active
router.delete("/:id", protect, adminOrCreatorOnly, coursesAdminOnly, softDeleteCourse);

// Route: Get all courses
// Access: Courses Admins only
router.get("/", protect, coursesAdminOnly, getAllCourses);

// Route: Get active courses
// Access: Courses Admins only
router.get("/active", protect, coursesAdminOnly, getActiveCourses);

// Route: Get deleted courses
// Access: Courses Admins only
router.get("/deleted", protect, coursesAdminOnly, getDeletedCourses);

// Route: Get courses by grade
// Access: Subscribed students and courses admins
router.get("/:grade", protect, subscribedStudentOnly, getCoursesByGrade);

// Route: Get specific course content by ID
// Access: Subscribed students and courses admins
router.get("/content/:id", protect, subscribedStudentOnly, getCourseContent);

export default router;
