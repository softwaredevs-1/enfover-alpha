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
  
    // Prepare the payload with only email and password
    const payload = {
      email: formData.email,
      password: formData.password,
    };
  
    console.log("Payload Submitted:", payload); // Debug the payload before dispatching
  
    dispatch(login(payload))
      .unwrap()
      .then((data) => {
        console.log("Login successful, response:", data); // Log the full backend response
  
        // Ensure the backend response has a role
        if (data?.role) {
          const { role } = data;
  
          // Navigate based on the user's role
          switch (role) {
            case "SuperAdmin":
              navigate("/super-admin/dashboard");
              break;
            case "Admin":
              navigate("/admin/dashboard");
              break;
            case "Teacher":
              navigate("/teacher/dashboard");
              break;
            case "Student":
            default:
              navigate("/student/dashboard");
              break;
          }
        } else {
          console.error("Role not found in response. Check backend response structure.");
          alert("Something went wrong. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Login failed:", err);
  
        // Graceful error handling with clear user feedback
        const errorMessage =
          typeof err === "string"
            ? err
            : "Login failed. Please check your credentials and try again.";
        alert(errorMessage);
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
