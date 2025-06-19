const User = require("../models/user");
const bcrypt = require("bcryptjs");

// 🧑‍💼 GET: All Users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.json(users);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// 🔐 PUT: Change Password (for logged-in user)
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { currentPassword, newPassword } = req.body;

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password Change Error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
};

// 👑 PUT: Update User Role (Admin only)
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "staff"].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: `User role updated to ${role}`, user });
  } catch (err) {
    console.error("Update Role Error:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
};
