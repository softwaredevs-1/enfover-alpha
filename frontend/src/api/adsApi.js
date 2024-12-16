import axiosInstance from "./axiosConfig";

// Ads API Service

// Create a new Ad (AdsAdmin only)
export const createAd = async (adData) => {
  const response = await axiosInstance.post("/ads", adData);
  return response.data;
};

// Get active Ads
export const getActiveAds = async () => {
  const response = await axiosInstance.get("/ads/active");
  return response.data;
};

// Edit an Ad (AdsAdmin only)
export const editAd = async (adId, updatedData) => {
  const response = await axiosInstance.put(`/ads/${adId}`, updatedData);
  return response.data;
};

// Remove an Ad (AdsAdmin only)
export const deleteAd = async (adId) => {
  const response = await axiosInstance.delete(`/ads/${adId}`);
  return response.data;
};
