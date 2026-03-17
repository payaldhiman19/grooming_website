const path = require("path");
const multer = require("multer");
const Product = require("../models/Product");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

exports.createProducts = [
  upload.single("product_image"),
  async (req, res) => {
    try {
      const { product_name, product_price, quantity } = req.body || {};
      const file = req.file;

      if (!product_name || !product_price || !quantity || !file) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

      const product = await Product.create({
        product_name,
        product_price,
        quantity,
        product_image: imageUrl,
      });

      return res.status(201).json(product);
    } catch (err) {
      console.error("Error creating product:", err);
      return res.status(500).json({ error: "Failed to create product" });
    }
  },
];

exports.getAllProducts = async () => {
  const products = await Product.find().lean();
  return products;
};

exports.searchProducts = async (query) => {
  const regex = new RegExp(query, "i");
  const products = await Product.find({ product_name: regex }).lean();
  return products;
};

