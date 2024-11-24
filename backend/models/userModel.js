import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "Student", enum: ["Student", "Teacher", "Admin", "Super Admin"] },
    grade: { type: String, required: function () { return this.role === "Student"; } }, // Only for students
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
