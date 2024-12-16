import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "", // Gender selection
    role: "Student", // Default role
    grade: "",
    areaOfStudy: "", // For teachers
    adminRole: "", // For admins
  });

  const { name, email, password, confirmPassword, gender, role, grade, areaOfStudy, adminRole } =
    formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    dispatch(register(formData))
      .unwrap()
      .then(() => {
        alert("Registration successful! Please login.");
        navigate("/login");
      })
      .catch(() => console.error("Registration failed"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-md transition-all duration-500 ease-in-out"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">Create an Account</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Name */}
        <div className="relative mb-4">
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-4 py-2 rounded-md border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition duration-300"
            required
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition duration-300"
            required
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition duration-300"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 rounded-md border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition duration-300"
            required
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600 font-medium">Gender</label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                onChange={handleChange}
                className="mr-2 accent-purple-500"
              />
              Male
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                onChange={handleChange}
                className="mr-2 accent-purple-500"
              />
              Female
            </label>
          </div>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600 font-medium">Role</label>
          <select
            name="role"
            value={role}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-purple-300 transition duration-300"
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Grade for Students */}
        {role === "Student" && (
          <div className="mb-4">
            <label className="block mb-2 text-gray-600 font-medium">Grade</label>
            <input
              type="text"
              name="grade"
              value={grade}
              onChange={handleChange}
              placeholder="Enter Grade"
              className="w-full px-4 py-2 rounded-md border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition duration-300"
              required
            />
          </div>
        )}

        {/* Area of Study for Teachers */}
        {role === "Teacher" && (
          <div className="mb-4">
            <label className="block mb-2 text-gray-600 font-medium">Area of Study</label>
            <input
              type="text"
              name="areaOfStudy"
              value={areaOfStudy}
              onChange={handleChange}
              placeholder="Enter Area of Study"
              className="w-full px-4 py-2 rounded-md border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition duration-300"
              required
            />
          </div>
        )}

        {/* Admin Role for Admins */}
        {role === "Admin" && (
          <div className="mb-4">
            <label className="block mb-2 text-gray-600 font-medium">Admin Role</label>
            <select
              name="adminRole"
              value={adminRole}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-purple-300 transition duration-300"
              required
            >
              <option value="userAdmin">User Admin</option>
              <option value="newsAdmin">News Admin</option>
              <option value="adsAdmin">Ads Admin</option>
              <option value="coursesAdmin">Courses Admin</option>
              <option value="competitionAdmin">Competition Admin</option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition duration-300"
          disabled={loading}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-purple-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log In
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
