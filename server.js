const dotenv = require("dotenv");
dotenv.config();


const app = require("./app");
const connectDB = require("./src/config/db");
const scheduleNotifications = require("./src/jobs/notificationScheduler");

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    //console.log(`Server running on port ${PORT}`);
    console.log('Server is running on http://localhost:3000');
  });
});

scheduleNotifications();