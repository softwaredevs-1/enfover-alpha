import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },

    area: {
           type: String,
           required: function () {
           return this.role === "Teacher";
    },
   },

    role: {
      type: String,
      enum: ["Student", "Teacher", "Admin", "SuperAdmin"],
      default: "Student",
    },
    adminRole: {
      type: String,
      enum: ["competitionAdmin", "coursesAdmin", "adsAdmin", "newsAdmin", "userAdmin"],
      required: function () {
        return this.role === "Admin"; // Only required if role is Admin
      }
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
    invitedBy: { type: String }, // Store the inviteCode of the inviter
    invitedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // List of users invited by this user
    invitedEmails: [
      {
        type: String, // Store email addresses as strings
      },
    ],
    
    points: { type: Number, default: 0 }, // Points earned by inviting users
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
