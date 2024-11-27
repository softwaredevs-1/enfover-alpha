import News from "../models/newsModel.js";

// Get all news articles
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a news article (Admin only)
export const createNews = async (req, res) => {
  const { title, body } = req.body;

  try {
    const news = await News.create({
      title,
      body,
      createdBy: req.user.id,
    });

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a news article (Admin only)
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (news) {
      await news.remove();
      res.json({ message: "News article removed" });
    } else {
      res.status(404).json({ message: "News not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
