import mongoose from "mongoose";

const adsSchema = mongoose.Schema(
  {
    title: { type: String }, // Optional ad title
    content: {
      type: {
        type: String, // Type of ad content: "Image", "Video", "Text", etc.
        enum: ["Image", "Video", "Text"],
        required: true,
      },
      url: { type: String }, // URL for external content (e.g., hosted files)
      file: { type: String }, // File path for uploaded content
    },
    startDate: { type: Date, required: true }, // When the ad should start showing
    endDate: { type: Date, required: true }, // When the ad should stop showing
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to Admin user
    },
    status: { type: String, enum: ["active", "deleted"], default: "active" }, // Status for soft delete
  },
  {
    timestamps: true, // Automatically include createdAt and updatedAt
  }
);

const Ad = mongoose.model("Ad", adsSchema);

export default Ad;
