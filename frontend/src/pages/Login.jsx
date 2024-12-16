import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login(formData))
      .unwrap()
      .then((data) => {
        // Navigate based on user role
        const { role } = data;
        if (role === "SuperAdmin") navigate("/super-admin/dashboard");
        else if (role === "Admin") navigate("/admin/dashboard");
        else if (role === "Teacher") navigate("/teacher/dashboard");
        else navigate("/student/dashboard");
      })
      .catch(() => {
        console.error("Login failed");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-md transition-all duration-500 ease-in-out"
      >
        {/* Title */}
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">
          Welcome Back!
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Email Input */}
        <div className="relative mb-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-4 py-2 border-2 rounded-md border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border-2 rounded-md border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-2 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition duration-300"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {/* Forgot Password and Register Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <span
              className="text-purple-500 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
