import mongoose from "mongoose";

const adsSchema = mongoose.Schema(
  {
    title: { type: String }, // Optional ad title
    content: { type: String, required: true }, // Ad content (e.g., image/video URL or text)
    startDate: { type: Date, required: true }, // When the ad should start showing
    endDate: { type: Date, required: true }, // When the ad should stop showing
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to Admin user
    },
  },
  {
    timestamps: true, // Automatically include createdAt and updatedAt
  }
);

const Ad = mongoose.model("Ad", adsSchema);

export default Ad;
