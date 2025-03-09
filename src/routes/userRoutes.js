const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();

// Admin-only route to get all users
router.get("/users", authenticateUser, authorizeRoles(["admin"]), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// User route to get personal profile
router.get("/profile", authenticateUser, authorizeRoles(["user", "admin"]), async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

module.exports = router;
