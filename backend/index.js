const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({
  origin: "https://grooming-website-8i4ad2j42-payal-dhimans-projects.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Static folders (frontend expects these URLs)
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", adminRoutes);
app.use("/", productRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in backend/.env");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });


