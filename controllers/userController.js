const userModel = require("../models/userModel");
const { calculateMonthlyExpenses } = require("../helpers/expenseHelper");

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

//Register Callback
const registerController = async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

// Set expense limit
const setExpenseLimitController = async (req, res) => {
  try {
    const { userId, expenseLimit } = req.body;

    if (!userId || !expenseLimit) {
      return res.status(400).json({
        success: false,
        message: "UserId and expenseLimit are required",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { expenseLimit: Number(expenseLimit) },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense limit updated successfully",
      expenseLimit: user.expenseLimit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get expense limit
const getExpenseLimitController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      expenseLimit: user.expenseLimit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get monthly expenses
const getMonthlyExpensesController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    const currentExpenses = await calculateMonthlyExpenses(userId);
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const percentageUsed = (currentExpenses / user.expenseLimit) * 100;

    res.status(200).json({
      success: true,
      currentExpenses,
      expenseLimit: user.expenseLimit,
      remaining: user.expenseLimit - currentExpenses,
      percentageUsed: percentageUsed.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  setExpenseLimitController,
  getExpenseLimitController,
  getMonthlyExpensesController,
};
