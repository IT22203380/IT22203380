const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  // Log the error using the logger
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  // Determine the status code, defaulting to 500 if it's 200
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Send the error response with the appropriate status and message
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
