import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

// Middleware to protect routes (require valid token)
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token); // Debug log

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug log

      // Attach user to the request object
      req.user = await User.findById(decoded.id).select("-password");
      console.log("User found:", req.user); // Debug log

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next(); // Proceed to the next middleware
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.error("Authorization header missing or invalid");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware for admin-only access
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "Admin" || req.user.role === "SuperAdmin")) {
    next(); // Proceed if user is Admin or SuperAdmin
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};


// Middleware for student-only access with payment verification
export const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === "Student") {
    if (!req.user.isSubscribed) {
      return res.status(403).json({ message: "Access denied. Payment required." });
    }
    next();
  } else {
    res.status(403).json({ message: "Access denied. Students only." });
  }
};

// Middleware for teacher-only access
export const teacherOnly = (req, res, next) => {
  if (req.user && req.user.role === "Teacher") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Teachers only." });
  }
};


// Middleware for teachers and admins at the same time (eg. deleting of the courses)
export const adminOrCreatorOnly = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isCreator = req.user.id === course.createdBy.toString();
    const isAdminOrSuperAdmin = req.user.role === "Admin" || req.user.role === "SuperAdmin";

    if (isCreator || isAdminOrSuperAdmin) {
      next();
    } else {
      res.status(403).json({
        message: "Access denied. You can only delete your own courses or must be an Admin/SuperAdmin.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
