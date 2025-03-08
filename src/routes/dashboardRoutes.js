const express = require("express");
const { getAdminDashboard, getUserDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin", authMiddleware, getAdminDashboard);
router.get("/user", authMiddleware, getUserDashboard);

module.exports = router;
