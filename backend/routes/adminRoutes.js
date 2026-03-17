const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllers");

// Register a new admin / employee
router.post("/admin-register", adminController.registerAdmin);

// Admin login
router.post("/get-all-admins", adminController.loginAdmin);

module.exports = router;
