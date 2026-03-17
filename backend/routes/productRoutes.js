const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Add product (used in AdminPage.jsx)
router.post("/add-product", productController.createProducts);

// Get all products (used in Home.jsx and AdminPage.jsx)
router.get("/api/products", async (req, res) => {
  try {
    const products = await productController.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Search products by name (used in Header.jsx)
router.get("/search/products", async (req, res) => {
  try {
    const q = req.query.q || "";
    const results = await productController.searchProducts(q);
    res.json({ results });
  } catch (err) {
    console.error("Error searching products:", err);
    res.status(500).json({ error: "Failed to search products" });
  }
});

module.exports = router;