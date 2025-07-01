const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Forgot Password - Check if user exists
router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User found, proceed to reset password", email });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Reset Password - Update the user's password
router.post("/reset-password", async (req, res) => {
  const { email , newPassword } = req.body;

  try {
    const user = await User.findOne({ email });


    // Hash new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
