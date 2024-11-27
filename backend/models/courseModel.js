import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    grade: { type: String, required: true }, // E.g., "Grade 1", "KG"
    title: { type: String, required: true },
    description: { type: String },
    content: [
      {
        type: { type: String, enum: ["Video", "Material", "Quiz"], required: true },
        url: { type: String, required: true }, // Video/material URL
        title: { type: String, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to the Teacher who created the course
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
