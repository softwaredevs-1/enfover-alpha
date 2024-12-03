import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: {type: String, required: true},
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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
