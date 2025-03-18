const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers'); // Adjust the path if needed

// Route to register an admin
router.post('/admin', adminController.registerAdmin);

module.exports = router;
