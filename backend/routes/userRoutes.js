const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

// POST /api/users/register (with input validation)
router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Enter valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters")
  ],
  registerUser
);

// POST /api/users/login
router.post("/login", loginUser);

// GET /api/users/profile (Protected)
router.get("/profile", protect, getProfile);

module.exports = router;
