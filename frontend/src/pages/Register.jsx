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
    gender: "",
    role: "Student", // Default role
    grade: "", // For Students
    areaOfStudy: "", // For Teachers
    adminRole: "", // For Admins
  });

  const {
    name,
    email,
    password,
    confirmPassword,
    gender,
    role,
    grade,
    areaOfStudy,
    adminRole,
  } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate confirm password
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare payload dynamically based on role
    const payload = {
      name,
      email,
      password,
      gender,
      role,
    };

    if (role === "Student") {
      if (!grade) {
        alert("Grade is required for Students.");
        return;
      }
      payload.grade = grade; // Map "grade" to the payload
    }

    if (role === "Teacher") {
      if (!areaOfStudy) {
        alert("Area of Study is required for Teachers.");
        return;
      }
      payload.area = areaOfStudy; // Match "area" as expected by the backend
    }

    if (role === "Admin") {
      if (!adminRole) {
        alert("Admin Role is required for Admins.");
        return;
      }
      payload.adminRole = adminRole; // Match "adminRole" as expected by the backend
    }

    // Submit the payload
    console.log("Payload Submitted:", payload);

    dispatch(register(payload))
      .unwrap()
      .then(() => {
        alert("Registration successful! Please login.");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Registration failed:", err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-md transition-all duration-500 ease-in-out"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">
          Create an Account
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Name */}
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full px-4 py-2 mb-4 border rounded-md"
          required
        />

        {/* Gender */}
        <label className="block mb-2 text-gray-600 font-medium">Gender</label>
        <div className="flex mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={gender === "Male"}
              onChange={handleChange}
            />
            <span className="ml-2">Male</span>
          </label>
          <label className="flex items-center ml-6">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === "Female"}
              onChange={handleChange}
            />
            <span className="ml-2">Female</span>
          </label>
        </div>

        {/* Role */}
        <label className="block mb-2 text-gray-600 font-medium">Role</label>
        <select
          name="role"
          value={role}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-md"
        >
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Admin">Admin</option>
        </select>

        {/* Conditional Fields */}
        {role === "Student" && (
          <input
            type="text"
            name="grade"
            value={grade}
            onChange={handleChange}
            placeholder="Grade"
            className="w-full px-4 py-2 mb-4 border rounded-md"
            required
          />
        )}

        {role === "Teacher" && (
          <input
            type="text"
            name="areaOfStudy"
            value={areaOfStudy}
            onChange={handleChange}
            placeholder="Area of Study"
            className="w-full px-4 py-2 mb-4 border rounded-md"
            required
          />
        )}

        {role === "Admin" && (
          <select
            name="adminRole"
            value={adminRole}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 border rounded-md"
            required
          >
            <option value="">Select Admin Role</option>
            <option value="userAdmin">User Admin</option>
            <option value="newsAdmin">News Admin</option>
            <option value="adsAdmin">Ads Admin</option>
            <option value="coursesAdmin">Courses Admin</option>
            <option value="competitionAdmin">Competition Admin</option>
          </select>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          disabled={loading}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {/* Login Redirect */}
        <p className="mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-purple-500 cursor-pointer hover:underline"
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
