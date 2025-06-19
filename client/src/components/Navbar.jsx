import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null; // Hide navbar if user is not logged in

  return (
    <nav className="bg-[#2d2e35] shadow-md px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-indigo-700 font-semibold hover:underline">
          Dashboard
        </Link>
        <Link to="/products" className="text-indigo-700 font-semibold hover:underline">
          Products
        </Link>
        <Link to="/profile" className="text-indigo-700 font-semibold hover:underline">
          Profile
        </Link>

        {/* ✅ Show only for admins */}
        {user?.role === "admin" && (
          <Link to="/users" className="text-yellow-600 font-semibold hover:underline">
            Manage Users
          </Link>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
