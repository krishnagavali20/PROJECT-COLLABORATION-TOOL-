const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/userController");

const router = express.Router();

// 1. USER + ADMIN PROTECTED DASHBOARD
router.get("/dashboard", protect, (req, res) => {
  res.json({
    message: "Welcome to the protected dashboard",
    user: req.user
  });
});

// 2. ADMIN ONLY ROUTE
router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin! You can access this page."
    });
  }
);

// 3. USER PROFILE (Exp 5 compatibility)
router.get("/profile", protect, getProfile);

module.exports = router;
