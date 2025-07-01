const express = require("express");
const router = express.Router();
const Bookform = require("../models/BookForm");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/",verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // get full user details
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bookingData = {
      ...req.body,
      name: user.name,
      email: user.email,
      status: 'pending'
    };

    const booking = new Bookform(bookingData);
    await booking.save();

    res.status(201).json({ message: 'Booking created', booking });
    
  } catch (error) { 
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/requests', async (req, res) => {
  try {
    const bookings = await Bookform.find({ status: 'pending' });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/approved', async (req, res) => {
  try {
    const bookings = await Bookform.find({ status: 'approved' });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/lists',verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const bookings = await Bookform.find({email});
    // console.log(bookings);
    if (!bookings) return console.log("no bookings");
    
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.patch('/approve/:id', async (req, res) => {
  try {
    const booking = await Bookform.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.status(200).json({ message: 'Booking approved', booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve booking' });
  }
});

module.exports = router;