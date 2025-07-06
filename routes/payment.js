const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const BookForm = require("../models/BookForm");
const router = express.Router();

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
router.post("/order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // amount in paise (₹1 = 100 paise)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// Verify payment
router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed.." });
  }
});

module.exports = router;
