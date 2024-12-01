import Competition from "../models/competitionModel.js";

// Get all competition Results for Admins
export const getCompetitionsAdmin = async (req, res) => {
  try {
    const competitions = await Competition.find().populate("participants.user", "name email");

    res.status(200).json(competitions); // Return full data for admins
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all competitions for Students
export const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find();

    // Format the response for students
    const studentView = competitions.map((competition) => ({
      _id: competition._id,
      title: competition.title,
      description: competition.description,
      deadline: competition.deadline,
      prizes: competition.prizes,
      questions: competition.questions.map((question) => ({
        _id: question._id,
        questionText: question.questionText,
        options: question.options.map((option) => ({
          text: option.text, // Exclude `isCorrect`
        })),
      })),
    }));

    res.status(200).json(studentView);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // Calculate the score
    let score = 0;

    // Iterate through submitted answers
    answers.forEach((answer) => {
      const question = competition.questions.id(answer.questionId);
      if (question) {
        // Find the correct option for the question
        const correctOption = question.options.find((option) => option.isCorrect);
        if (correctOption && correctOption.text === answer.selectedOption) {
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

    // Save the updated competition
    await competition.save();

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

    // Use deleteOne to remove the competition
    await competition.deleteOne();

    res.status(200).json({ message: "Competition removed successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting competition: ${error.message}` });
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