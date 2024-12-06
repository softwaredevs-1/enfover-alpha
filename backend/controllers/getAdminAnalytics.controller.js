import AdminAnalytics from "../models/adminAnalyticsModel.js";
import Ad from "../models/adsModel.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const now = new Date();

    // Calculate ads-related analytics dynamically
    const totalAds = await Ad.countDocuments({ status: "active" });
    const totalExpiredAds = await Ad.countDocuments({
      endDate: { $lt: now },
      status: "active",
    });
    const totalDeletedAds = await Ad.countDocuments({ status: "deleted" });

    // Retrieve or initialize admin analytics document
    let analytics = await AdminAnalytics.findOne({});

    if (!analytics) {
      // Create a new analytics document if none exists
      analytics = await AdminAnalytics.create({
        totalCompetitions: 0,
        totalParticipants: 0,
        totalAds,
        totalExpiredAds,
        totalDeletedAds,
      });
    } else {
      // Update existing analytics document with ads data
      analytics.totalAds = totalAds;
      analytics.totalExpiredAds = totalExpiredAds;
      analytics.totalDeletedAds = totalDeletedAds;

      await analytics.save();
    }

    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching admin analytics:", error.message);
    res.status(500).json({ message: error.message });
  }
};
