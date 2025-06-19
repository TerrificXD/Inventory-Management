import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        alert(err.response?.data?.error || "Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await API.put(`/users/${id}/role`, { role: newRole });
      setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert("Failed to update role");
    }
  };

  if (user?.role !== "admin")
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        ⛔ Access denied. Admins only.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
        👥 User Management
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
        <table className="w-full table-auto text-sm">
          <thead className="bg-indigo-200 text-indigo-900">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-indigo-50 transition">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                    ${u.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                    }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3">
                  {u.role === "admin" ? (
                    <button
                      onClick={() => handleRoleChange(u._id, "staff")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-xs"
                    >
                      Demote to Staff
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRoleChange(u._id, "admin")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-full text-xs"
                    >
                      Promote to Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
