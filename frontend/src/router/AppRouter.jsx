import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login.jsx";
// import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* Add more routes for SuperAdmin, Admins, Teachers, and Students */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
