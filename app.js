const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");


const authRoutes = require("./src/routes/authRoutes.js");
const transactionRoutes = require("./src/routes/transactionRoutes.js");
const budgetRoutes = require("./src/routes/budgetRoutes");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Finance Tracker API is running..." });
});

module.exports = app;
