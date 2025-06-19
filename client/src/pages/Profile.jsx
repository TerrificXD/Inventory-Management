import React, { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await API.put("/users/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error changing password");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      {/* User Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-indigo-200 flex items-center justify-center text-3xl font-bold text-white">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">{user?.name}</h2>
          <p className="text-gray-600"><span className="font-medium">Email:</span> {user?.email}</p>
          <p className="text-gray-600"><span className="font-medium">Role:</span> {user?.role}</p>
          <p className="text-gray-600"><span className="font-medium">Company:</span> {user?.company}</p>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Current Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">New Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
          {message && (
            <p className={`text-sm mt-2 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
