import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    role: {
      type: String,
      enum: ["Student", "Teacher", "Admin", "SuperAdmin"],
      default: "Student",
    },
    grade: {
      type: String,
      required: function () {
        return this.role === "Student";
      },
    },
    activityStatus: {
      type: String,
      enum: ["active", "blocked"],
      default: "active", // Admin manages this
    },
    subscriptionStatus: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "unsubscribed", // Default is unsubscribed until payment
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
