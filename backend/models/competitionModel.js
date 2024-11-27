import mongoose from "mongoose";

const competitionSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    prizes: { type: String }, // E.g., "First place: $100"
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Admin who created the competition
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        submission: {
          type: String, // URL or file path of the submission
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Competition = mongoose.model("Competition", competitionSchema);

export default Competition;
