import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    grade: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    content: [
      {
        type: { type: String, enum: ["Video", "Material", "Quiz"], required: true },
        url: { type: String, required: true },
        title: { type: String, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;