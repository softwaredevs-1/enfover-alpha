import axiosInstance from "./axiosConfig";

// Course API Service

// Add a new course (Teacher only)
export const addCourse = async (courseData) => {
  const response = await axiosInstance.post("/courses", courseData);
  return response.data;
};

// Get all courses (Admin only)
export const getAllCourses = async () => {
  const response = await axiosInstance.get("/courses");
  return response.data;
};

// Get active courses
export const getActiveCourses = async () => {
  const response = await axiosInstance.get("/courses/active");
  return response.data;
};

// Get course content by ID (Students/Teachers/Admins)
export const getCourseContentById = async (courseId) => {
  const response = await axiosInstance.get(`/courses/content/${courseId}`);
  return response.data;
};

// Get courses by grade (Students only)
export const getCoursesByGrade = async (grade) => {
  const response = await axiosInstance.get(`/courses/grade/${grade}`);
  return response.data;
};
