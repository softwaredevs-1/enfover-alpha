import Competition from "../models/competitionModel.js";
import AdminAnalytics from "../models/adminAnalyticsModel.js";


// Get all competition Results for Admins
export const getCompetitionsAdmin = async (req, res) => {
  try {
    const competitions = await Competition.find().populate("participants.user", "name email");

    res.status(200).json(competitions); // Return full data for admins
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompetitionStud = async (req, res) => {
  try {
    const now = new Date();

    let query = { status: "active" }; // Default query for active competitions

    // Students can only see competitions with future deadlines
    if (req.user.role === "Student") {
      query.deadline = { $gte: now };
    }

    // Fetch competitions excluding the "questions" and "participants" fields
    const competitions = await Competition.find(query).select("-questions -participants");

    res.status(200).json(competitions);
  } catch (error) {
    console.error("Error fetching competitions:", error.message); // Debug log
    res.status(500).json({ message: error.message });
  }
};


export const getCompetitions = async (req, res) => {
  try {
    const now = new Date();

    let query = { status: "active" }; // Default query for active competitions

    // Students can only see competitions with future deadlines
    if (req.user.role === "Student") {
      query.deadline = { $gte: now };
    }

    const competitions = await Competition.find(query, "-questions");
    res.status(200).json(competitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompetitionContent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the competition by ID
    const competition = await Competition.findById(id);

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // Build response based on the role
    let response = {
      _id: competition._id,
      title: competition.title,
      description: competition.description,
      deadline: competition.deadline,
      prizes: competition.prizes,
      status: competition.status,
      createdBy: competition.createdBy,
      createdAt: competition.createdAt,
      updatedAt: competition.updatedAt,
      questions: competition.questions, // Include questions for students and admins
    };

    // Include participants without their answers
    if (competition.participants && competition.participants.length > 0) {
      response.participants = competition.participants.map((participant) => ({
        user: {
          _id: participant.user._id,
          name: participant.user.name,
          email: participant.user.email,
        },
        score: participant.score, // Include score but exclude answers
      }));
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: `Error fetching competition content: ${error.message}` });
  }
};



// Create a new competition (Admin only)
export const createCompetition = async (req, res) => {
  const { title, description, deadline, prizes, questions } = req.body;

  try {
    const competition = await Competition.create({
      title,
      description,
      deadline,
      prizes,
      questions, // Add questions to the competition
      createdBy: req.user.id,
    });

    // Increment totalCompetitions in AdminAnalytics
    await AdminAnalytics.findOneAndUpdate(
      {},
      { $inc: { totalCompetitions: 1 } },
      { upsert: true } // Create if it doesn't exist
    );

    res.status(201).json(competition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Students Submitting answers
export const submitAnswers = async (req, res) => {
  const { competitionId, answers } = req.body;

  try {
    // Find the competition by ID
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // Check if the competition has ended
    if (new Date() > competition.deadline) {
      return res.status(400).json({ message: "Competition has already ended" });
    }

       // Check if the user has already submitted answers
       const alreadyParticipated = competition.participants.some(
        (participant) => participant.user.toString() === req.user.id
      );
  
      if (alreadyParticipated) {
        return res.status(400).json({ message: "You have already submitted answers for this competition." });
      }

    // Calculate the score
    let score = 0;

    // Iterate through submitted answers
    answers.forEach((answer) => {
      const question = competition.questions.id(answer.questionId);
      if (question) {
        // Find the correct option for the question
        const correctOption = question.options.find((option) => option.isCorrect);
        if (correctOption && correctOption.id === answer.selectedOption) {
          score += 1; // Increment score for each correct answer
        }
      }
    });

    // Add the participant's submission
    competition.participants.push({
      user: req.user.id, // The logged-in student's ID
      answers,          // Submitted answers
      score,            // Calculated score
    });

    
    // Increment participant count and save updated count
    competition.numberOfParticipants += 1;
    await competition.save();

    // Increment totalParticipants in AdminAnalytics
    await AdminAnalytics.findOneAndUpdate(
      {},
      { $inc: { totalParticipants: 1 } },
      { upsert: true }
    );

    res.status(200).json({ message: "Answers submitted successfully", score });
  } catch (error) {
    res.status(500).json({ message: `Error submitting answers: ${error.message}` });
  }
};

// Update an existing competition (Admin only)
export const updateCompetition = async (req, res) => {
  const { id } = req.params; // Competition ID
  const { title, description, deadline, prizes, questions } = req.body;

  try {
    const competition = await Competition.findById(id);

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // Update fields if provided
    if (title) competition.title = title;
    if (description) competition.description = description;
    if (deadline) competition.deadline = deadline;
    if (prizes) competition.prizes = prizes;
    if (questions) competition.questions = questions;

    // Save updated competition
    const updatedCompetition = await competition.save();

    res.status(200).json(updatedCompetition);
  } catch (error) {
    res.status(500).json({ message: `Error updating competition: ${error.message}` });
  }
};

// Delete a competition (Admin only)
export const deleteCompetition = async (req, res) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findById(id);

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // Perform a soft delete by updating the status
    competition.status = "deleted";
    await competition.save();

    res.status(200).json({ message: "Competition marked as deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting competition: ${error.message}` });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const analytics = await AdminAnalytics.findOne({});

    if (!analytics) {
      return res.status(200).json({ totalCompetitions: 0, totalParticipants: 0 });
    }

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






// 1. Examples for the post payload( add new competition)
// {
//   "title": "Math Quiz",
//   "description": "A challenging math competition",
//   "deadline": "2024-12-31T23:59:59.000Z",
//   "prizes": "First place: $100",
//   "questions": [
//     {
//       "questionText": "What is 2 + 2?",
//       "options": [
//         { "text": "3", "isCorrect": false },
//         { "text": "4", "isCorrect": true },
//         { "text": "5", "isCorrect": false }
//       ]
//     },
//     {
//       "questionText": "What is 10 / 2?",
//       "options": [
//         { "text": "2", "isCorrect": false },
//         { "text": "5", "isCorrect": true },
//         { "text": "10", "isCorrect": false }
//       ]
//     }
//   ]
// }

// 2. Example for the put payload (update competition)