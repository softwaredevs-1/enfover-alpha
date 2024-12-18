import axiosInstance from "./axiosConfig";

// User API Service

// Register a new user
export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/users/register", userData);
  return response.data;
};

// Login a user
export const loginUser = async (credentials) => {
  console.log("Login Payload Sent to Server:", credentials); // Debug the payload
  try {
    const response = await axiosInstance.post("/users/login", credentials);
    console.log("Server Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in login API:", error.response?.data || error.message);
    throw error;
  }
};


// Fetch user profile
// Fetch user profile
export const getUserProfile = async () => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  if (!token) throw new Error("No authentication token found.");

  try {
    const response = await axiosInstance.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization Bearer Token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    throw error;
  }
};

// Generate Invite Link (Student only)
export const generateInviteLink = async () => {
  const token = localStorage.getItem("token"); // Retrieve the token
  if (!token) throw new Error("No authentication token found.");

  const response = await axiosInstance.get("/users/invite-link", {
    headers: {
      Authorization: `Bearer ${token}`, // Add bearer token
    },
  });

  return response.data.inviteLink; // Return the generated invite link
};


// Edit user profile
export const editUserProfile = async (updatedData) => {
  const response = await axiosInstance.put("/users/profile", updatedData);
  return response.data;
};

// // Generate an invite link (Student only)
// export const generateInviteLink = async () => {
//   const response = await axiosInstance.get("/users/invite-link");
//   return response.data;
// };

// Get inviter points (Student only)
export const getInviterPoints = async () => {
  const response = await axiosInstance.get("/users/points");
  return response.data;
};



// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await axiosInstance.get("/users/all");
  return response.data;
};



// Fetch top inviters (SuperAdmin only)
export const getTopInviters = async () => {
  const response = await axiosInstance.get("/users/top-inviters");
  return response.data;
};
export const getAnalytics = async () => {
  const response = await axiosInstance.get("/analytics");
  return response.data;
};
