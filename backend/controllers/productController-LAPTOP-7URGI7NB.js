const Product = require('../models/Product');

// Controller to handle the creation of products
const createProducts = async (req, res) => {
  try {
    const products = req.body.products;

    
    await Product.insertMany(products);

    res.status(201).json({ message: 'Products added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding products' });
  }
};

module.exports = {
  createProducts
};
