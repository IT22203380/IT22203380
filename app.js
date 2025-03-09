const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");


const authRoutes = require("./src/routes/authRoutes.js");
const transactionRoutes = require("./src/routes/transactionRoutes.js");
const budgetRoutes = require("./src/routes/budgetRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const goalRoutes = require("./src/routes/goalRoutes");
const errorHandler = require("./src/middlewares/errorMiddleware");
const logger = require("./src/config/logger");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(errorHandler);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/goals", goalRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Finance Tracker API is running..." });
});

app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

module.exports = app;
