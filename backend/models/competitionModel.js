import mongoose from "mongoose";

const optionSchema = mongoose.Schema(
  {
    text: { type: String, required: true }, // Option text
    isCorrect: { type: Boolean, required: true }, // Whether this option is correct
  },
  { _id: false } // Prevent automatic `_id` for options
);

const questionSchema = mongoose.Schema(
  {
    questionText: { type: String, required: true }, // Question text
    options: [optionSchema], // Array of options
  }
);

const participantSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId, // Reference to the question
        selectedOption: String, // The answer selected by the student
      },
    ],
    score: { type: Number, default: 0 }, // Total score of the participant
  },
  { _id: false }
);

const competitionSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    prizes: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        answers: [
          {
            questionId: mongoose.Schema.Types.ObjectId,
            selectedOption: String,
          },
        ],
        score: Number,
      },
    ],
    questions: [
      {
        questionText: String,
        options: [
          {
            text: String,
            isCorrect: Boolean,
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
    numberOfParticipants: { type: Number, default: 0 }, // New field
  },
  { timestamps: true }
);




const Competition = mongoose.model("Competition", competitionSchema);

export default Competition;
