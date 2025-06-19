const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUserRole,
  changePassword,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.use(authMiddleware);

router.get("/", isAdmin, getAllUsers);
router.put("/:id/role", isAdmin, updateUserRole);
router.put("/change-password", changePassword);

module.exports = router;
