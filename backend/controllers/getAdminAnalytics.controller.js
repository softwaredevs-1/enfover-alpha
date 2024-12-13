import AdminAnalytics from "../models/adminAnalyticsModel.js";
import Ad from "../models/adsModel.js";
import User from "../models/userModel.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const now = new Date();

    // Ads-related statistics
    const totalAds = await Ad.countDocuments({ status: "active" });
    const totalExpiredAds = await Ad.countDocuments({
      endDate: { $lt: now },
      status: "active",
    });
    const totalDeletedAds = await Ad.countDocuments({ status: "deleted" });

    // User-related statistics
    const totalStudents = await User.countDocuments({ role: "Student" });
    const activeStudents = await User.countDocuments({
      role: "Student",
      activityStatus: "active",
    });
    const blockedStudents = await User.countDocuments({
      role: "Student",
      activityStatus: "blocked",
    });

    const totalTeachers = await User.countDocuments({ role: "Teacher" });
    const activeTeachers = await User.countDocuments({
      role: "Teacher",
      activityStatus: "active",
    });
    const verifiedTeachers = await User.countDocuments({
      role: "Teacher",
      verificationStatus: "verified",
    });
    const blockedTeachers = await User.countDocuments({
      role: "Teacher",
      activityStatus: "blocked",
    });
    const pendingTeachers = await User.countDocuments({
      role: "Teacher",
      verificationStatus: "pending",
    });

    const totalAdmins = await User.countDocuments({ role: "Admin" });
    const activeAdmins = await User.countDocuments({
      role: "Admin",
      activityStatus: "active",
    });
    const blockedAdmins = await User.countDocuments({
      role: "Admin",
      activityStatus: "blocked",
    });
    const verifiedAdmins = await User.countDocuments({
      role: "Admin",
      verificationStatus: "verified",
    });
    const pendingAdmins = await User.countDocuments({
      role: "Admin",
      verificationStatus: "pending",
    });
    const rejectedAdmins = await User.countDocuments({
      role: "Admin",
      verificationStatus: "rejected",
    });

    // Admin role breakdown
    const competitionAdmins = await User.countDocuments({
      role: "Admin",
      adminRole: "competitionAdmin",
    });
    const coursesAdmins = await User.countDocuments({
      role: "Admin",
      adminRole: "coursesAdmin",
    });
    const adsAdmins = await User.countDocuments({
      role: "Admin",
      adminRole: "adsAdmin",
    });
    const newsAdmins = await User.countDocuments({
      role: "Admin",
      adminRole: "newsAdmin",
    });

    // Invite-related statistics
    const totalInvitedUsers = await User.countDocuments({ invitedBy: { $exists: true } });
    const totalPointsEarned = await User.aggregate([
      { $match: { points: { $exists: true } } },
      { $group: { _id: null, totalPoints: { $sum: "$points" } } },
    ]);
    const topInviters = await User.find({ role: "Student" })
      .sort({ points: -1 })
      .limit(10)
      .select("name email points");

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

    // Return analytics with additional user-related and invite-related data
    res.status(200).json({
      analytics,
      users: {
        students: {
          total: totalStudents,
          active: activeStudents,
          blocked: blockedStudents,
        },
        teachers: {
          total: totalTeachers,
          active: activeTeachers,
          verified: verifiedTeachers,
          blocked: blockedTeachers,
          pending: pendingTeachers,
        },
        admins: {
          total: totalAdmins,
          active: activeAdmins,
          blocked: blockedAdmins,
          verified: verifiedAdmins,
          pending: pendingAdmins,
          rejected: rejectedAdmins,
          role: {
            competitionAdmins,
            coursesAdmins,
            adsAdmins,
            newsAdmins,
          },
        },
      },
      invites: {
        totalInvitedUsers,
        totalPointsEarned: totalPointsEarned.length > 0 ? totalPointsEarned[0].totalPoints : 0,
        topInviters,
      },
    });
  } catch (error) {
    console.error("Error fetching admin analytics:", error.message);
    res.status(500).json({ message: error.message });
  }
};
