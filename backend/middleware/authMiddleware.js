import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

// Middleware to protect routes (require valid token)
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      console.log("User found:", req.user);

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware for admin-only access
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "Admin" || req.user.role === "SuperAdmin")) {
    {
      if (req.user.verificationStatus !== "verified") {
        return res.status(403).json({ message: "Access denied. User not verified." });
      }
    }
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

export const subscribedStudentOnly = (req, res, next) => {
  if (req.user && req.user.role === "Student" && req.user.subscriptionStatus === "subscribed") {
    next();
  } else {
    res.status(403).json({
      message: "Access denied. Only subscribed students can access this content.",
    });
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
    const isAdminOrSuperAdmin = req.user.role === "courseAdmin" || req.user.role === "SuperAdmin";

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

export const superAdminOnly = (req, res, next) => {
  console.log("User role:", req.user.role); // Log user role
  if (req.user && req.user.role === "SuperAdmin") {
    next();
  } else {
    res.status(403).json({
      message: "Access denied. Super Admins only.",
    });
  }
};

export const verifiedOnly = (req, res, next) => {
  // Allow verified Admins, Teachers, and SuperAdmins only
  if (req.user.role === "Admin" || req.user.role === "Teacher") {
    if (req.user.verificationStatus !== "verified") {
      return res
        .status(403)
        .json({ message: "Access denied. User not verified." });
    }
  }

  // SuperAdmins are always allowed without verification check
  if (req.user.role === "SuperAdmin") {
    return next();
  }

  next();
};



export const verifiedActiveTeacherOnly = (req, res, next) => {
  if (req.user.role === "Teacher") {
    if (req.user.activityStatus !== "active") {
      return res.status(403).json({ message: "Your account is not active." });
    }
    if (req.user.verificationStatus !== "verified") {
      return res.status(403).json({ message: "Your account is not verified." });
    }
    next();
  } else {
    res.status(403).json({ message: "Access denied. Teachers only." });
  }
};

export const verifiedActiveAdminOnly = (req, res, next) => {
  if (req.user.role === "Admin" || req.user.role === "SuperAdmin") {
    if (req.user.activityStatus !== "active") {
      return res.status(403).json({ message: "Your account is not active." });
    }
    if (req.user.role === "Admin" && req.user.verificationStatus !== "verified") {
      return res.status(403).json({ message: "Your account is not verified." });
    }
    next(); // Proceed if verified and active
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};




export const userAdminOnly = (req, res, next) => {
  if (
    (req.user.role === "SuperAdmin") ||
    (req.user.role === "Admin" && req.user.adminRole === "userAdmin" && req.user.activityStatus === "active" && req.user.verificationStatus === "verified")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. User Admins only." });
  }
};

export const competitionAdminOnly = (req, res, next) => {
  if (
    (req.user.role === "SuperAdmin") ||
    (req.user.role === "Admin" && req.user.adminRole === "competitionAdmin" && req.user.activityStatus === "active" && req.user.verificationStatus === "verified")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Competition Admins only." });
  }
};

export const coursesAdminOnly = (req, res, next) => {
  if (
    (req.user.role === "SuperAdmin") ||
    (req.user.role === "Admin" && req.user.adminRole === "coursesAdmin" && req.user.activityStatus === "active" && req.user.verificationStatus === "verified")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Courses Admins only." });
  }
};

export const adsAdminOnly = (req, res, next) => {
  if (
    (req.user.role === "SuperAdmin") ||
    (req.user.role === "Admin" && req.user.adminRole === "adsAdmin" && req.user.activityStatus === "active" && req.user.verificationStatus === "verified")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Ads Admins only." });
  }
};

export const newsAdminOnly = (req, res, next) => {
  if (
    (req.user.role === "SuperAdmin") ||
    (req.user.role === "Admin" && req.user.adminRole === "newsAdmin" && req.user.activityStatus === "active" && req.user.verificationStatus === "verified")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. News Admins only." });
  }
};

