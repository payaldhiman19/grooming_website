const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const User = require("../models/User");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, passwordHash });

    return res.json({ ok: true });
  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({ error: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ error: "Login failed" });
  }
};

exports.userDetails = async (req, res) => {
  const user = await User.findById(req.user._id).select("name email avatarId");
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json(user);
};

exports.deleteAccount = async (req, res) => {
  await User.deleteOne({ _id: req.user._id });
  return res.json({ message: "Deleted" });
};

exports.uploadAvatar = [
  upload.single("avatar"),
  async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file" });

    await User.updateOne({ _id: req.user._id }, { avatarId: file.filename });
    return res.json({ avatarId: file.filename });
  },
];

exports.listUsers = async () => {
  const users = await User.find().select("name email").lean();
  return users;
};



