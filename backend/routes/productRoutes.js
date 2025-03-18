const express = require('express');
const router = express.Router();
const { createProducts } = require('../controllers/productController');

// Route to handle the creation of products
router.post('/products', createProducts);

module.exports = router;