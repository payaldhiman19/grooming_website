const bcrypt = require("bcryptjs");
const Admin = require("../models/admin-LAPTOP-7URGI7NB");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Admin with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: passwordHash,
      role,
    });

    const token = admin.generateAuthToken();

    return res.status(201).json({
      message: "Admin registered successfully",
      token,
    });
  } catch (err) {
    console.error("Error in registerAdmin:", err);
    return res.status(500).json({ error: "Failed to register admin" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const token = admin.generateAuthToken();

    return res.json({ token });
  } catch (err) {
    console.error("Error in loginAdmin:", err);
    return res.status(500).json({ error: "Failed to login admin" });
  }
};

