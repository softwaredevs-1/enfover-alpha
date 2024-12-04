import mongoose from "mongoose";

const newsSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, enum: ["active", "deleted"], default: "active" }, // Active or soft deleted
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt
  }
);

const News = mongoose.model("News", newsSchema);

export default News;
