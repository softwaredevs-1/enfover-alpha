import Course from "../models/courseModel.js";

// Get courses by grade
export const getCoursesByGrade = async (req, res) => {
  const { grade } = req.params;

  try {
    const courses = await Course.find({ grade });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a course (Teacher only)
export const addCourseContent = async (req, res) => {
  const { grade, title, description, content } = req.body;

  try {
    const course = await Course.create({
      grade,
      title,
      description,
      content,
      createdBy: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get specific course content by ID
export const getCourseContent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};