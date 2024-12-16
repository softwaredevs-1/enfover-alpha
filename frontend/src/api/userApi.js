import axiosInstance from "./axiosConfig";

// User API Service

// Register a new user
export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/users/register", userData);
  return response.data;
};

// Login a user
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post("/users/login", credentials);
  return response.data;
};

// Fetch user profile
export const getUserProfile = async () => {
  const response = await axiosInstance.get("/users/profile");
  return response.data;
};

// Edit user profile
export const editUserProfile = async (updatedData) => {
  const response = await axiosInstance.put("/users/profile", updatedData);
  return response.data;
};

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await axiosInstance.get("/users/all");
  return response.data;
};

// Generate an invite link (Student only)
export const generateInviteLink = async () => {
  const response = await axiosInstance.get("/users/invite-link");
  return response.data;
};

// Get inviter points (Student only)
export const getInviterPoints = async () => {
  const response = await axiosInstance.get("/users/points");
  return response.data;
};

// Fetch top inviters (SuperAdmin only)
export const getTopInviters = async () => {
  const response = await axiosInstance.get("/users/top-inviters");
  return response.data;
};
