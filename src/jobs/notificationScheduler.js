const cron = require("node-cron");
const User = require("../models/User");
const { checkBudgetLimit, checkUnusualSpending, sendNotification } = require("../utils/notificationUtils");
const Goal = require("../models/Goal");

const checkGoalProgress = async (userId) => {
  const goals = await Goal.find({ user: userId, isCompleted: false });

  for (const goal of goals) {
    const percentage = (goal.savedAmount / goal.targetAmount) * 100;

    if (percentage >= 75) {
      await sendNotification(userId, `You're 75% towards achieving your goal: ${goal.name}! Keep going!`, "goal");
    }
  }
};

const scheduleNotifications = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("Running scheduled notifications check...");
    const users = await User.find();
    for (const user of users) {
      await checkBudgetLimit(user._id);
      await checkUnusualSpending(user._id);
      await checkGoalProgress(user._id);
    }
  });

  cron.schedule("0 9 * * *", async () => {
    console.log("Checking goal progress...");
    const users = await User.find();
    for (const user of users) {
      await checkGoalProgress(user._id);
    }
  });
};

module.exports = scheduleNotifications;
