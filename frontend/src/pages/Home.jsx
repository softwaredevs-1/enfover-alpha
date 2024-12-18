import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
    
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6 text-green-600">Welcome to Enfover</h1>
      <p className="text-lg text-gray-700 mb-4 text-center">
        A platform for students, teachers, admins, and super admins to collaborate effectively.
      </p>

      <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
        <Link
          to="/register"
          className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700"
        >
          Login
        </Link>

      </div>
    </div>
        <Footer/>
    

    
    </>
  );
};

export default Home;
