import axiosInstance from "./axiosConfig";

// News API Service

// Post news (NewsAdmin only)
export const postNews = async (newsData) => {
  const response = await axiosInstance.post("/news", newsData);
  return response.data;
};

// Get all active news
export const getActiveNews = async () => {
  const response = await axiosInstance.get("/news/active");
  return response.data;
};

// Edit news (NewsAdmin only)
export const editNews = async (newsId, updatedData) => {
  const response = await axiosInstance.put(`/news/${newsId}`, updatedData);
  return response.data;
};
