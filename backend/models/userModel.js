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
    adminRole: {
      type: String,
      enum: ["competitionAdmin", "coursesAdmin", "adsAdmin", "newsAdmin", "userAdmin"],
      required: function () {
        return this.role === "Admin";
      },
    },
    grade: {
      type: String,
      required: function () {
        return this.role === "Student";
      },
    },
    activityStatus: { type: String, enum: ["active", "blocked"], default: "active" },

    subscriptionStatus: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: function () {
        return this.role === "Student" ? "unsubscribed" : undefined;
      },
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: function () {
        return this.role === "Teacher" || this.role === "Admin" ? "pending" : undefined;
      },
    },
    inviteCode: { type: String, unique: true }, // Unique invite code for each user
    invitedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // List of users invited by this user
    points: { type: Number, default: 0 }, // Points earned by inviting users
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
