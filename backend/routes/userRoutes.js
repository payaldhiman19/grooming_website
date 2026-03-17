const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const assessmentController = require("../controllers/assessmentController");
const auth = require("../middleware/auth");

// Public auth routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Simple protected test route (used in Login.jsx)
router.get("/protected-route", auth, (req, res) => {
  res.json({ ok: true, userId: req.user._id });
});

// Current logged-in user details (used in Header.jsx)
router.get("/user-details", auth, userController.userDetails);

// Account management
router.delete("/me", auth, userController.deleteAccount);
router.post("/avatar", auth, userController.uploadAvatar);

// Admin: list all users (used in AdminPage.jsx)
router.get("/api/users", async (req, res) => {
  try {
    const users = await userController.listUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Assessment form submit (used in AssessmentForm.jsx)
router.post("/api/submit-assessment", assessmentController.submitAssessment);

module.exports = router;

