import Course from "../models/courseModel.js";


// Add a course (Teacher only)
// Add a course (Verified and Active Teachers Only)
export const addCourseContent = async (req, res) => {
  const { grade, title, description, content } = req.body;

  try {
    // Check if the user is active and verified
    if (req.user.activityStatus !== "active") {
      return res.status(403).json({ message: "Your account is not active." });
    }
    if (req.user.verificationStatus !== "verified") {
      return res.status(403).json({ message: "Your account is not verified." });
    }

    // Proceed to create the course
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

//soft delete a course 
export const softDeleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only allow the course creator or admin to delete
    if (req.user.role !== "Admin" && req.user.id !== course.createdBy.toString()) {
      return res.status(403).json({ message: "Access denied. You can only delete your own courses." });
    }

    // Soft delete by changing the status
    course.status = "deleted";
    await course.save();

    res.status(200).json({ message: "Course removed successfully (soft delete)." });
  } catch (error) {
    res.status(500).json({ message: `Error removing course: ${error.message}` });
  }
};





// Get a list of all courses (Admin or SuperAdmin only, without content field)
export const getAllCourses = async (req, res) => {
  try {
    // console.log("User info:", req.user); // Debug log

    // Validate admin or super admin role
    if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch all courses excluding the content field
    const courses = await Course.find({}, "-content");

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error.message); // Debug log
    res.status(500).json({ message: error.message });
  }
};

// Get course content by course ID
export const getCourseContentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch course by ID and return only the content
    const course = await Course.findById(id, "content");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course.content);
  } catch (error) {
    console.error("Error fetching course content:", error.message); // Debug log
    res.status(500).json({ message: error.message });
  }
};




// Get active courses
export const getActiveCourses = async (req, res) => {
  try {
    const activeCourses = await Course.find({ status: "active" }, "-content");

    if (!activeCourses.length) {
      return res.status(404).json({ message: "No active courses found." });
    }

    res.status(200).json(activeCourses);
  } catch (error) {
    res.status(500).json({ message: `Error fetching active courses: ${error.message}` });
  }
};

// Get deleted courses
export const getDeletedCourses = async (req, res) => {
  try {
    const deletedCourses = await Course.find({ status: "deleted" }, "-content");

    if (!deletedCourses.length) {
      return res.status(404).json({ message: "No deleted courses found." });
    }

    res.status(200).json(deletedCourses);
  } catch (error) {
    res.status(500).json({ message: `Error fetching deleted courses: ${error.message}` });
  }
};





// Get courses by grade
export const getCoursesByGrade = async (req, res) => {
  const { grade } = req.params;
  // console.log("Requested grade:", grade); // Log grade for debugging

  try {
    const courses = await Course.find({ grade, status: "active" });
    // console.log("Found courses:", courses); // Log found courses
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get specific course content by ID
export const getCourseContent = async (req, res) => {
  try {
    // Find the course by ID and ensure it's active
    const course = await Course.findOne({ _id: req.params.id, status: "active" });

    if (course) {
      res.status(200).json(course); // Return the course details
    } else {
      res.status(404).json({ message: "Course not found or inactive" }); // Updated message for better clarity
    }
  } catch (error) {
    console.error("Error fetching course content:", error.message); // Debug log
    res.status(500).json({ message: "Server error. Please try again later." });
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