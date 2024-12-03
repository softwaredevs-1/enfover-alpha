import Course from "../models/courseModel.js";


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



// Update course details (Teacher only)
export const updateCourse = async (req, res) => {
  const { id } = req.params; // Course ID
  const { grade, title, description, content } = req.body;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the logged-in user is the course creator
    if (req.user.role !== "Admin" && req.user.id !== course.createdBy.toString()) {
      return res.status(403).json({ message: "Access denied. Not authorized to update this course." });
    }

    // Update fields
    if (grade) course.grade = grade;
    if (title) course.title = title;
    if (description) course.description = description;
    if (content) course.content = content;

    const updatedCourse = await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({ message: `Error updating course: ${error.message}` });
  }
};




// Get a list of all registered users (Admin only)
export const getAllCourses = async (req, res) => {
  try {
    // Check if the requester is an admin
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch all Courses excluding their passwords
    const courses = await Course.find();

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




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





// Example: 
// {
//     "grade": "kg",
//     "title": "Alphabets",
//     "description": "The ultimate start of an education",
//     "content": [
//       {
//         "type": "Video",
//         "url": "https://example.com/hpe-video.mp4",
//         "title": "Introduction to HPE"
//       },
//       {
//         "type": "Material",
//         "url": "https://example.com/hpe-material.pdf",
//         "title": "HPE Reading Material"
//       },
//       {
//         "type": "Quiz",
//         "url": "https://example.com/hpe-quiz-link",
//         "title": "HPE Quiz 1"
//       }
//     ]
//   }