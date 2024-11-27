import Competition from "../models/competitionModel.js";

// Get all competitions
export const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find();
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new competition (Admin only)
export const createCompetition = async (req, res) => {
  const { title, description, deadline, prizes } = req.body;

  try {
    const competition = await Competition.create({
      title,
      description,
      deadline,
      prizes,
      createdBy: req.user.id,
    });

    res.status(201).json(competition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a competition (Admin only)
export const deleteCompetition = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (competition) {
      await competition.remove();
      res.json({ message: "Competition removed" });
    } else {
      res.status(404).json({ message: "Competition not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
