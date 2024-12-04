import Ad from "../models/adsModel.js";
import AdminAnalytics from "../models/adminAnalyticsModel.js";

// @desc    Create a new ad
// @route   POST /api/ads
// @access  Admin
export const createAd = async (req, res) => {
  const { title, contentType, startDate, endDate } = req.body;

  try {
    // Handle file upload
    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/ads/${req.file.filename}`; // Path to uploaded file
    }

    // Create the ad
    const ad = await Ad.create({
      title,
      content: {
        type: contentType, // "Image", "Video", or "Text"
        url: fileUrl || req.body.url, // Use uploaded file or provided URL
      },
      startDate,
      endDate,
      createdBy: req.user.id, // Admin creating the ad
    });

    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ message: `Error creating ad: ${error.message}` });
  }
};


// @desc    Get all active ads (e.g., based on date range)
// @route   GET /api/ads
// @access  Public
export const getActiveAds = async (req, res) => {
  const now = new Date(); // Current time for comparison

  try {
    // Fetch ads within the specified date range and status is "active"
    const ads = await Ad.find({
      startDate: { $lte: now }, // Ads that have started
      endDate: { $gte: now },   // Ads that haven't ended
      status: "active",         // Ensure only active ads are fetched
    });

    res.status(200).json(ads);
  } catch (error) {
    console.error("Error fetching active ads:", error.message);
    res.status(500).json({ message: `Error fetching active ads: ${error.message}` });
  }
};

// @desc    Get all scheduled ads (not yet visible, startDate in the future)
// @route   GET /api/ads/scheduled
// @access  Admin
export const getScheduledAds = async (req, res) => {
  const now = new Date(); // Current time for comparison

  try {
    // Fetch ads with startDate in the future and status is "active"
    const ads = await Ad.find({
      startDate: { $gt: now },
      status: "active",
    });

    res.status(200).json(ads);
  } catch (error) {
    console.error("Error fetching scheduled ads:", error.message);
    res.status(500).json({ message: `Error fetching scheduled ads: ${error.message}` });
  }
};
// @desc    Get all active ads (e.g., based on date range)
// @route   GET /api/ads
// @access  Public

export const getDeletedAds = async (req, res) => {
  const now = new Date();

  try {
    const ads = await Ad.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: "deleted", // Exclude soft-deleted ads
    });

    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ads: ${error.message}` });
  }
};


// @desc    Edit an ad
// @route   PUT /api/ads/:id
// @access  Admin
export const editAd = async (req, res) => {
  const { id } = req.params;
  const { title, content, startDate, endDate } = req.body;

  try {
    const ad = await Ad.findById(id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // Update fields if provided
    if (title) ad.title = title;
    if (content) ad.content = content;
    if (startDate) ad.startDate = startDate;
    if (endDate) ad.endDate = endDate;

    const updatedAd = await ad.save();

    res.status(200).json({ message: "Ad updated successfully", ad: updatedAd });
  } catch (error) {
    res.status(500).json({ message: `Error updating ad: ${error.message}` });
  }
};


// @desc    Delete an ad (Hard)
// @route   DELETE /api/ads/:id
// @access  Admin
export const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    await ad.remove();
    res.status(200).json({ message: "Ad removed successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting ad: ${error.message}` });
  }
};


// @desc    Delete an ad (Soft)
// @route   DELETE /api/ads/:id
// @access  Admin
export const softDeleteAd = async (req, res) => {
  const { id } = req.params;

  try {
    const ad = await Ad.findById(id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    if (ad.status === "deleted") {
      return res.status(400).json({ message: "Ad is already deleted" });
    }

    // Soft delete the ad
    ad.status = "deleted";
    await ad.save();

    // Decrement totalAds in AdminAnalytics
    await AdminAnalytics.findOneAndUpdate(
      {},
      { $inc: { totalAds: -1 } }
    );

    res.status(200).json({ message: "Ad marked as deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting ad: ${error.message}` });
  }
};


