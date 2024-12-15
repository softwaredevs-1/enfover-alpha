import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/generateToken.js";
import { nanoid } from "nanoid";


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// export const registerUser = async (req, res) => {
//   const { name, email, password, gender, role, grade, adminRole } = req.body;

//   try {
//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the user object
//     const userData = {
//       name,
//       email,
//       password: hashedPassword,
//       gender,
//       role: role || "Student", // Default role is Student
//       adminRole: role === "Admin" ? adminRole : undefined, // Assign admin role if Admin
//       grade: role === "Student" ? grade : undefined, // Only assign grade for students
//     };

//     // Set subscriptionStatus only for students
//     if (role === "Student" || !role) {
//       userData.subscriptionStatus = "unsubscribed";
//     }

//     // Save the user to the database
//     const user = await User.create(userData);

//     // Prepare the response object
//     const response = {
//       _id: user.id,
//       name: user.name,
//       email: user.email,
//       gender: user.gender,
//       role: user.role,
//       adminRole: user.adminRole,
//       grade: user.grade,
//       token: generateTokenAndSetCookies(user.id, res),
//     };

//     // Include subscriptionStatus only for students
//     if (user.role === "Student") {
//       response.subscriptionStatus = user.subscriptionStatus;
//     }

//     res.status(201).json(response);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Register a new user
// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password, gender, role, grade } = req.body;
  const { inviteCode } = req.query; // Extract inviteCode from the query string

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if role is "SuperAdmin"
    if (role === "SuperAdmin") {
      return res.status(403).json({ message: "Registering as SuperAdmin is not allowed." });
    }

    // Check if a SuperAdmin already exists
    const superAdminExists = await User.findOne({ role: "SuperAdmin" });
    if (!superAdminExists && role !== "SuperAdmin") {
      return res.status(400).json({ message: "A SuperAdmin must already exist in the system." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      gender,
      role: role || "Student", // Default role is Student
      inviteCode: nanoid(8), // Generate a unique inviteCode for this user
    };

    // Assign subscriptionStatus for Students
    if (role === "Student") {
      userData.grade = grade; // Add grade for students
      userData.subscriptionStatus = "unsubscribed"; // Default subscription status

      // If an inviteCode is provided, handle the inviter logic
      if (inviteCode) {
        const inviter = await User.findOne({ inviteCode });

        if (inviter && inviter.role === "Student") {
          userData.invitedBy = inviter.inviteCode; // Store the inviter's inviteCode in the new user's data
        }
      }
    }

    // Create the user
    const user = await User.create(userData);

    const token = generateTokenAndSetCookies(user.id, res);

    // Build response object
    const response = {
      _id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      role: user.role,
      grade: user.grade,
      invitedBy: user.invitedBy,
      inviteCode: user.inviteCode, // Include the inviteCode in the response
      subscriptionStatus: user.subscriptionStatus,
      token,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// @desc    Authenticate a user and get token
// @route   POST /api/users/login
// @access  Public


// Authenticate a user and get token
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    if (user.activityStatus === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked. Contact admin." });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateTokenAndSetCookies(user.id, res);

    // Build the response object
    const response = {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminRole: user.adminRole,
      grade: user.grade,
      activityStatus: user.activityStatus,
      verificationStatus: user.verificationStatus,
      inviteCode: user.inviteCode,
      invitedBy: user.invitedBy,
      token,
    };

    // Add subscriptionStatus only for Students
    if (user.role === "Student") {
      response.subscriptionStatus = user.subscriptionStatus;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout a user
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration to the past
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error logging out: ${error.message}` });
  }
};


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    // Get user from request (set in middleware)
    const user = await User.findById(req.user.id).select("-password"); // Exclude password

    if (user) {
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        grade: user.grade,
        subscriptionStatus: user.subscriptionStatus,
        verificationStatus: user.verificationStatus,
        activityStatus: user.activityStatus,
        inviteCode: user.inviteCode,
        invitedBy: user.invitedBy,
        invitedUsers: user.invitedUsers,
        invitedEmails:user.invitedEmails,
        points: user.points
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let passwordChanged = false;

    // Check if the request includes a new password
    if (req.body.password) {
      const { currentPassword, password } = req.body;

      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change your password." });
      }

      // Verify the current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }

      // Update password
      user.password = await bcrypt.hash(password, 10);
      passwordChanged = true;
    }

    // Update other profile details
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.gender = req.body.gender || user.gender;

    const updatedUser = await user.save();

    const response = {
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      role: updatedUser.role,
      grade: updatedUser.grade,
    };

    if (passwordChanged) {
      response.message = "Password updated successfully.";
    } else {
      response.message = "Profile updated successfully.";
    }


    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a list of all registered users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Check if the requester is an admin or super admin
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // For Admins, ensure they are verified
    if (req.user.role === "Admin" && req.user.verificationStatus !== "verified") {
      return res.status(403).json({ message: "Access denied. Only verified admins can access this data." });
    }

    // Fetch all users excluding their passwords
    const users = await User.find().select("-password");

    // Map users to include only relevant fields
    const formattedUsers = users.map((user) => {
      let formattedUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        activityStatus: user.activityStatus,
        subscriptionStatus: user.subscriptionStatus,
        invitedBy: user.invitedBy,
        inviteCode: user.inviteCode
      };

      // Include subscriptionStatus only for students
      if (user.role === "Student") {
        formattedUser.subscriptionStatus = user.subscriptionStatus;
        formattedUser.grade = user.grade; // Include grade for students
      }

      // Include verificationStatus for teachers and admins
      if (user.role === "Teacher" || user.role === "Admin") {
        formattedUser.verificationStatus = user.verificationStatus;
        if (user.role === "Admin") {
          formattedUser.adminRole = user.adminRole; // Include admin role
        }
      }

      return formattedUser;
    });

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Admin: Update activity status (active/blocked)
export const updateActivityStatus = async (req, res) => {
  const { id } = req.params; // Ensure the ID comes from params
  const { activityStatus } = req.body; // Ensure this key matches the payload

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["active", "blocked"].includes(activityStatus)) {
      return res.status(400).json({ message: "Invalid activity status value" });
    }

    user.activityStatus = activityStatus;
    await user.save();

    res.status(200).json({ message: `User activity status updated to ${activityStatus}` });
  } catch (error) {
    res.status(500).json({ message: `Error updating activity status: ${error.message}` });
  }
};
// Get a list of all blocked users (Admin only)
export const getBlockedUsers = async (req, res) => {
  try {
    const blockedUsers = await User.find({ activityStatus: "blocked" }).select("-password");

    if (!blockedUsers.length) {
      return res.status(404).json({ message: "No blocked users found" });
    }

    res.status(200).json(blockedUsers);
  } catch (error) {
    res.status(500).json({ message: `Error fetching blocked users: ${error.message}` });
  }
};
export const getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await User.find({ activityStatus: "active" }).select("-password");

    if (!activeUsers.length) {
      return res.status(404).json({ message: "No Active users found" });
    }

    res.status(200).json(activeUsers);
  } catch (error) {
    res.status(500).json({ message: `Error fetching active users: ${error.message}` });
  }
}
// Get a list of all active students
export const getActiveStudents = async (req, res) => {
  try {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch users with role "Student" and activityStatus "active"
    const students = await User.find({ role: "Student", activityStatus: "active" }).select("-password");

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get a list of all active teachers
export const getActiveTeachers = async (req, res) => {
  try {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch users with role "Teacher" and activityStatus "active"
    const teachers = await User.find({ role: "Teacher", activityStatus: "active" }).select("-password");

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






// Student: Update subscription status (subscribed/unsubscribed)
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "Student") {
      return res.status(403).json({ message: "Only students can update subscription status" });
    }

    if (user.subscriptionStatus === "unsubscribed") {
      // Update subscription status to "subscribed"
      user.subscriptionStatus = "subscribed";

      // If the user was invited, update inviter's points and invitedUsers list
      if (user.invitedBy) {
        const inviter = await User.findOne({ inviteCode: user.invitedBy }); // Find inviter by inviteCode

        if (inviter) {
          inviter.points = (inviter.points || 0) + 1; // Increment inviter's points
          inviter.invitedUsers = [...(inviter.invitedUsers || []), user._id]; // Add this user's _id to inviter's invitedUsers
          inviter.invitedEmails = [...(inviter.invitedEmails || []), user.email]; // Track invited user's email
          await inviter.save();
        }
      }
    } else {
      // Update subscription status to "unsubscribed"
      user.subscriptionStatus = "unsubscribed";
    }

    await user.save();

    res.status(200).json({ message: `Your subscription status is now ${user.subscriptionStatus}` });
  } catch (error) {
    res.status(500).json({ message: `Error updating subscription status: ${error.message}` });
  }
};





//This handles invite codes during registration.
export const handleInvite = async (inviteCode) => {
  try {
    const inviter = await User.findOne({ inviteCode });
    if (!inviter) {
      return null;
    }
    return inviter._id; // Return inviter's ID
  } catch (error) {
    console.error("Error handling invite:", error.message);
    return null;
  }
};

// Generate a student's invite link
export const generateInviteLink = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "Student") {
      return res.status(403).json({ message: "Only students can generate an invite link" });
    }

    if (!user.inviteCode) {
      return res.status(400).json({ message: "Invite code not available for the user" });
    }

    const inviteLink = `${process.env.CLIENT_URL}/register?inviteCode=${user.inviteCode}`; // Include inviteCode in the URL

    res.status(200).json({ inviteLink });
  } catch (error) {
    res.status(500).json({ message: `Error generating invite link: ${error.message}` });
  }
};



// Get top inviters (Super Admin only)
// Get top inviters (Super Admin only)
export const getTopInviters = async (req, res) => {
  try {
    // Find top inviters sorted by points in descending order
    const topInviters = await User.find({ role: "Student", points: { $gt: 0 } })
      .select("name email points invitedUsers invitedEmails")
      .sort({ points: -1 }) // Sort by points in descending order
      .limit(10); // Limit to top 10 inviters

    if (!topInviters.length) {
      return res.status(404).json({ message: "No inviters found." });
    }

    res.status(200).json(topInviters);
  } catch (error) {
    res.status(500).json({ message: `Error fetching top inviters: ${error.message}` });
  }
};


// Get points for a student inviter
// Get points for a student inviter
export const getInviterPoints = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "Student") {
      return res.status(403).json({ message: "Only students can access their invite points." });
    }

    // Return inviter details with points
    res.status(200).json({
      inviter: {
        name: user.name,
        email: user.email,
        points: user.points || 0, // Use points and default to 0 if not set
        invitedUsers: user.invitedUsers || [], // Include invited users
        invitedEmails: user.invitedEmails || [], // Include invited emails
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Error fetching inviter points: ${error.message}` });
  }
};






// Get a list of all subscribed students (Admin only)
export const getSubscribedUsers = async (req, res) => {
  try {
    // Fetch only students with "subscribed" status
    const subscribedStudents = await User.find({ role: "Student", subscriptionStatus: "subscribed" }).select("-password");

    if (!subscribedStudents.length) {
      return res.status(404).json({ message: "No subscribed students found" });
    }

    res.status(200).json(subscribedStudents);
  } catch (error) {
    res.status(500).json({ message: `Error fetching subscribed students: ${error.message}` });
  }
};

// Get a list of all unsubscribed students (Admin only)
export const getUnsubscribedUsers = async (req, res) => {
  try {
    // Fetch only students with "unsubscribed" status
    const unsubscribedStudents = await User.find({ role: "Student", subscriptionStatus: "unsubscribed" }).select("-password");

    if (!unsubscribedStudents.length) {
      return res.status(404).json({ message: "No unsubscribed students found" });
    }

    res.status(200).json(unsubscribedStudents);
  } catch (error) {
    res.status(500).json({ message: `Error fetching unsubscribed students: ${error.message}` });
  }
};


export const verifyUser = async (req, res) => {
  const { id } = req.params;
  const { verificationStatus } = req.body; // Accept "verified" or "rejected"

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["pending", "verified", "rejected"].includes(verificationStatus)) {
      return res.status(400).json({ message: "Invalid verification status" });
    }

    if (user.role !== "Teacher" && user.role !== "Admin") {
      return res.status(400).json({ message: "Only teachers or admins can be verified" });
    }

    user.verificationStatus = verificationStatus;
    await user.save();

    res.status(200).json({
      message: `User verification status updated to ${verificationStatus}`,
    });
  } catch (error) {
    res.status(500).json({ message: `Error updating verification status: ${error.message}` });
  }
};

export const getVerifiedTeacher = async (req, res) => {
  try {
    const verifiedTeachers = await User.find({
      role: "Teacher",
      verificationStatus: "verified",
    }).select("-password");

    if (!verifiedTeachers.length) {
      return res
        .status(404)
        .json({ message: "No verified teachers found." });
    }

    res.status(200).json(verifiedTeachers);
  } catch (error) {
    res.status(500).json({ message: `Error fetching verified teachers: ${error.message}` });
  }
};

export const getVerifiedAdmin = async (req, res) => {
  try {
    const verifiedAdmins = await User.find({
      role: "Admin",
      verificationStatus: "verified",
    }).select("-password");

    if (!verifiedAdmins.length) {
      return res
        .status(404)
        .json({ message: "No verified admins found." });
    }

    res.status(200).json(verifiedAdmins);
  } catch (error) {
    res.status(500).json({ message: `Error fetching verified admins: ${error.message}` });
  }
};

export const getPendingUser = async (req, res) => {
  try {
    const pendingUser = await User.find({
      role: { $in: ["Teacher", "Admin"] }, // Query for both Teacher and Admin roles
      verificationStatus: "pending", // Only fetch pending users
    }).select("-password");

    if (!pendingUser.length) {
      return res.status(404).json({ message: "No pending users found." });
    }

    res.status(200).json(pendingUser);
  } catch (error) {
    res.status(500).json({ message: `Error fetching pending users: ${error.message}` });
  }
};

export const getRejectedUser = async (req, res) => {
  try {
    const rejectedUser = await User.find({
      role: { $in: ["Teacher", "Admin"] }, // Query for both Teacher and Admin roles
      verificationStatus: "rejected", // Only fetch pending users
    }).select("-password");

    if (!rejectedUser.length) {
      return res.status(404).json({ message: "No rejected users found." });
    }

    res.status(200).json(rejectedUser);
  } catch (error) {
    res.status(500).json({ message: `Error fetching rejected users: ${error.message}` });
  }
};


