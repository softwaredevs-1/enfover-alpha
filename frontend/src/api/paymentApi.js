import axiosInstance from "./axiosConfig";

// Payment API Service

// Initiate payment for subscription (Students only)
export const initiatePayment = async (paymentData) => {
  const response = await axiosInstance.post("/payments/subscribe", paymentData);
  return response.data;
};

// Verify payment status
export const verifyPayment = async (transactionId) => {
  const response = await axiosInstance.get(`/payments/verify/${transactionId}`);
  return response.data;
};
