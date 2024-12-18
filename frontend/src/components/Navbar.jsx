import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { FaCog, FaSignOutAlt, FaBell } from "react-icons/fa";
import { Avatar, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import ThemeToggle from "../components/ThemeToggle";

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth); // Access user and token
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // useEffect(() => {
  //   // Redirect to home page if user logs out
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, [token, navigate]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-gray-800 dark:text-gray-200"
          >
            Enfover
          </Link>

          {/* Theme Toggle and Notification */}
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            <button className="relative text-gray-800 dark:text-gray-200 hover:text-green-500">
              <FaBell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
          </div>

          {/* Conditional Rendering: User Dropdown OR Login/Register */}
          {user ? (
            <Menu placement="bottom-end">
              <MenuHandler>
                <div className="relative cursor-pointer">
                  {/* User Avatar */}
                  <Avatar
                    src={user.profileImage || "https://via.placeholder.com/150"}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                  />
                  {/* Status Indicator */}
                  <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                </div>
              </MenuHandler>

              {/* Dropdown Menu */}
              <MenuList className="shadow-xl rounded-md dark:bg-gray-700">
                {/* User Name */}
                <MenuItem className="py-3 px-4">
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {user.name || "User"}
                  </span>
                </MenuItem>

                {/* Account Settings */}
                <MenuItem
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all rounded-md px-4 py-2"
                >
                  <FaCog />
                  <span>Account Settings</span>
                </MenuItem>

                {/* Logout */}
                <MenuItem
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all rounded-md px-4 py-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-gray-800 dark:text-gray-200 hover:text-green-600 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-800 dark:text-gray-200 hover:text-green-600 transition-all"
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
