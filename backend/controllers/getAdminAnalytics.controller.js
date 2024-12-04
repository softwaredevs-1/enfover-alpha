import AdminAnalytics from "../models/adminAnalyticsModel.js";

export const getAdminAnalytics = async (req, res) => {
    try {
      const analytics = await AdminAnalytics.findOne({});
  
      if (!analytics) {
        return res.status(200).json({
          totalCompetitions: 0,
          totalParticipants: 0,
          totalAds: 0,
        });
      }
  
      res.status(200).json(analytics);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  