const express = require("express");
const {
  loginController,
  registerController,
  setExpenseLimitController,
  getExpenseLimitController,
  getMonthlyExpensesController,
} = require("../controllers/userController");

//router object
const router = express.Router();

//routers
// POST || LOGIN USER
router.post("/login", loginController);

//POST || REGISTER USER
router.post("/register", registerController);

//POST || SET EXPENSE LIMIT
router.post("/set-expense-limit", setExpenseLimitController);

//POST || GET EXPENSE LIMIT
router.post("/get-expense-limit", getExpenseLimitController);

//POST || GET MONTHLY EXPENSES
router.post("/get-monthly-expenses", getMonthlyExpensesController);

module.exports = router;
