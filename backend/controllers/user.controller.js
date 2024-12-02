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

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // Match the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token and set it in cookies
    const token = generateTokenAndSetCookies(user.id, res);

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      grade: user.grade,
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
