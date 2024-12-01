import Ad from "../models/adsModel.js";

// @desc    Create a new ad
// @route   POST /api/ads
// @access  Admin
export const createAd = async (req, res) => {
  const { title, content, startDate, endDate } = req.body;

  try {
    const ad = await Ad.create({
      title,
      content,
      startDate,
      endDate,
      createdBy: req.user.id, // Admin user creating the ad
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
  const now = new Date();

  try {
    const ads = await Ad.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ads: ${error.message}` });
  }
};

// @desc    Delete an ad
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
