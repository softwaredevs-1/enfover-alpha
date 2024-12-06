import mongoose from "mongoose";

const adminAnalyticsSchema = mongoose.Schema({
  totalCompetitions: { type: Number, default: 0 }, // Total competitions created
  totalParticipants: { type: Number, default: 0 }, // Total participants in competitions
  totalAds: { type: Number, default: 0 }, // Total ads created
  totalExpiredAds: { type: Number, default: 0 }, // Ads with expired time
  totalDeletedAds: { type: Number, default: 0 }, // Ads marked as deleted
});

const AdminAnalytics = mongoose.model("AdminAnalytics", adminAnalyticsSchema);

export default AdminAnalytics;
