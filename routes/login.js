// 
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role , email: user.email ,name : user.name}, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.json({ message: "Login successful..", token ,role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

module.exports = router;
