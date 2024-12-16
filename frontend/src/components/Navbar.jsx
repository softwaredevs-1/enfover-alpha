import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { FaSun, FaMoon, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Avatar, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import ThemeToggle from '../components/ThemeToggle.jsx';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false); // Dark/Light mode state
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // const toggleDarkMode = () => {
  //   setDarkMode((prev) => !prev);
  //   document.documentElement.classList.toggle("dark", !darkMode);
  // };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800 dark:text-gray-200"
            >
              Enfover
            </Link>
          </div>

          {/* Dark Mode Toggle */}
          <ThemeToggle />

          {/* Profile Menu */}
          {user && (
            <Menu placement="bottom-end">
              <MenuHandler>
                <div className="relative cursor-pointer">
                  {/* Profile Image */}
                  <Avatar
                    src={user.profileImage || "https://via.placeholder.com/150"}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                  />
                  {/* Status Indicator */}
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                </div>
              </MenuHandler>

              {/* Dropdown */}
              <MenuList className="shadow-lg rounded-md dark:bg-gray-700">
                <MenuItem className="flex items-center space-x-2 py-3 px-4">
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {user.name || "User"}
                  </span>
                </MenuItem>
                <MenuItem
                  className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  onClick={() => navigate("/profile")}
                >
                  <FaCog />
                  <span>Account settings</span>
                </MenuItem>
                <MenuItem
                  className="flex items-center space-x-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {!user && (
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-gray-800 dark:text-gray-200 hover:text-green-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-800 dark:text-gray-200 hover:text-green-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
