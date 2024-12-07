import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password,gender, role, grade } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      role: role || "Student", // Default role is Student
      grade: role === "Student" ? grade : undefined, // Only assign grade for students
      subscriptionStatus: "unsubscribed", // Default for students
    });

    // Generate token and set it in cookies
    const token = generateTokenAndSetCookies(user.id, res);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      role: user.role,
      grade: user.grade,
      token,
    });
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
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    if (user.activityStatus === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked. Contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateTokenAndSetCookies(user.id, res);

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      grade: user.grade,
      activityStatus: user.activityStatus,
      subscriptionStatus: user.subscriptionStatus,
      token,
    });
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

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.gender = req.body.gender || user.gender;
    user.password = req.body.password || user.password;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      role: updatedUser.role,
      grade: updatedUser.grade,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get a list of all registered users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Check if the requester is an admin
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch all users excluding their passwords
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a list of all subscribed users (Admin only)
export const getSubscribedUsers = async (req, res) => {
  try {
    const subscribedUsers = await User.find({ subscriptionStatus: "subscribed" }).select("-password");

    if (!subscribedUsers.length) {
      return res.status(404).json({ message: "No subscribed users found" });
    }

    res.status(200).json(subscribedUsers);
  } catch (error) {
    res.status(500).json({ message: `Error fetching subscribed users: ${error.message}` });
  }
};

// Get a list of all unsubscribed users (Admin only)
export const getUnsubscribedUsers = async (req, res) => {
  try {
    const unsubscribedUsers = await User.find({ subscriptionStatus: "unsubscribed" }).select("-password");

    if (!unsubscribedUsers.length) {
      return res.status(404).json({ message: "No unsubscribed users found" });
    }

    res.status(200).json(unsubscribedUsers);
  } catch (error) {
    res.status(500).json({ message: `Error fetching unsubscribed users: ${error.message}` });
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


// Admin: Update activity status (active/blocked)
export const updateActivityStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expect "active" or "blocked"

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ message: "Invalid activity status value" });
    }

    user.activityStatus = status;
    await user.save();

    res.status(200).json({ message: `User activity status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: `Error updating activity status: ${error.message}` });
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

    const newStatus = user.subscriptionStatus === "subscribed" ? "unsubscribed" : "subscribed";
    user.subscriptionStatus = newStatus;
    await user.save();

    res.status(200).json({ message: `Your subscription status is now ${newStatus}` });
  } catch (error) {
    res.status(500).json({ message: `Error updating subscription status: ${error.message}` });
  }
};


