import axiosInstance from "./axiosConfig";

// Competition API Service

// Add a new competition (Competition Admin only)
export const addCompetition = async (competitionData) => {
  const response = await axiosInstance.post("/competition", competitionData);
  return response.data;
};

// Get active competitions (Students)
export const getActiveCompetitions = async () => {
  const response = await axiosInstance.get("/competition/active-student");
  return response.data;
};

// Submit competition answers (Students)
export const submitCompetition = async (submissionData) => {
  const response = await axiosInstance.post("/competition/submit", submissionData);
  return response.data;
};

// Get competition content by ID (Students/Admins)
export const getCompetitionContent = async (competitionId) => {
  const response = await axiosInstance.get(`/competition/content/${competitionId}`);
  return response.data;
};
