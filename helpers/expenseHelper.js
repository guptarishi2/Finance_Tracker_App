const transectionModel = require("../models/transectionModel");
const userModel = require("../models/userModel");
const moment = require("moment");
const { sendWarningEmail } = require("../services/emailService");

// Calculate monthly expenses for a user
const calculateMonthlyExpenses = async (userId) => {
  try {
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const expenses = await transectionModel.find({
      userid: userId,
      type: "expense",
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    const totalExpenses = expenses.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    return totalExpenses;
  } catch (error) {
    console.error("Error calculating monthly expenses:", error);
    return 0;
  }
};

// Check if expense limit is exceeded and send warning
const checkAndSendWarning = async (userId) => {
  try {
    // Get user details
    const user = await userModel.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Check if warning already sent this month
    if (user.lastWarningDate) {
      const lastWarningMonth = moment(user.lastWarningDate).month();
      const currentMonth = moment().month();
      if (lastWarningMonth === currentMonth) {
        return {
          success: false,
          message: "Warning already sent this month",
        };
      }
    }

    // Calculate current month expenses
    const currentExpenses = await calculateMonthlyExpenses(userId);

    // Check if limit exceeded
    if (currentExpenses > user.expenseLimit) {
      const exceededBy = currentExpenses - user.expenseLimit;

      // Send warning email
      const emailResult = await sendWarningEmail(user.email, user.name, {
        currentExpenses,
        expenseLimit: user.expenseLimit,
        exceededBy,
      });

      if (emailResult.success) {
        // Update lastWarningDate
        await userModel.findByIdAndUpdate(userId, {
          lastWarningDate: new Date(),
        });

        return {
          success: true,
          message: "Warning email sent successfully",
          data: { currentExpenses, expenseLimit: user.expenseLimit },
        };
      } else {
        return {
          success: false,
          message: "Failed to send warning email",
          error: emailResult.error,
        };
      }
    }

    return {
      success: false,
      message: "Expense limit not exceeded",
      data: { currentExpenses, expenseLimit: user.expenseLimit },
    };
  } catch (error) {
    console.error("Error in checkAndSendWarning:", error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  calculateMonthlyExpenses,
  checkAndSendWarning,
};
