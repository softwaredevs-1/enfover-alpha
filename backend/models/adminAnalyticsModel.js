import mongoose from "mongoose";
const adminAnalyticsSchema = mongoose.Schema({
    totalCompetitions: { type: Number, default: 0 },
    totalParticipants: { type: Number, default: 0 },
  });
  
  const AdminAnalytics = mongoose.model("AdminAnalytics", adminAnalyticsSchema);
  
  export default AdminAnalytics;
  