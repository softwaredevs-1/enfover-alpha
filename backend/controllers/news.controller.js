import News from "../models/newsModel.js";

// Create a news article (Admin only)
export const createNews = async (req, res) => {
  const { title, body } = req.body;

  try {
    const news = await News.create({
      title,
      body,
      createdBy: req.user.id,
      status: "active", // Ensure the default status is active
    });

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get all news articles
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active news articles (visible to students)
export const getActiveNews = async (req, res) => {
  try {
    const news = await News.find({ status: "active" }); // Fetch only active news
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all deleted news articles (Admin Only)
export const getDeletedNews = async (req, res) => {
  try {
    const deletedNews = await News.find({ status: "deleted" });

    if (!deletedNews.length) {
      return res.status(404).json({ message: "No deleted news articles found" });
    }

    res.status(200).json(deletedNews);
  } catch (error) {
    res.status(500).json({ message: `Error fetching deleted news: ${error.message}` });
  }
};


// Update a news article (Admin only)
export const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  try {
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Update the fields if provided
    if (title) news.title = title;
    if (body) news.body = body;

    const updatedNews = await news.save();

    res.status(200).json({
      message: "News article updated successfully",
      news: updatedNews,
    });
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

// Soft delete a news article (Admin only)
export const softDeleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Soft delete by changing the status to "deleted"
    news.status = "deleted";
    await news.save();

    res.status(200).json({ message: "News article marked as deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


