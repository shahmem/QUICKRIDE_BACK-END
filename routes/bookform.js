const express = require("express");
const router = express.Router();
const Bookform = require("../models/BookForm");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // get full user details
    if (!user) return res.status(404).json({ message: "User not found" });

    const bookingData = {
      ...req.body,
      name: user.name,
      email: user.email,
      status: "pending",
      date: new Date(req.body.date),
      datetime: new Date(`${req.body.date}T${req.body.time}`),
      payment: "notpaid",
    };

    const booking = new Bookform(bookingData);
    await booking.save();

    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/requests", async (req, res) => {
  try {
    const { sort } = req.query;
    const now = new Date();

    const sortOptions = {
      "date-desc": { datetime: -1 },
      "date-asc": { datetime: 1 },
      "price-desc": { fare: -1 },
      "price-asc": { fare: 1 },
    };

    const bookings = await Bookform.find({
      status: "pending",
      datetime: { $gt: now },
    }).sort(sortOptions[sort], { datetime: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/approved", async (req, res) => {
  try {
    const now = new Date();
    const bookings = await Bookform.find({
      status: "approved",
      datetime: { $gte: now },
    }).sort({ datetime: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/lists", verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const { sort, filters } = req.query;

    const sortOptions = {
      "date-desc": { datetime: -1 },
      "date-asc": { datetime: 1 },
    };

    const query = { email };

    const now = new Date();
    query.datetime = { $gte: now };

    if (filters) {
      const filterArray = filters.split(",");

      // Filter for status
      const statusFilters = filterArray.filter((f) =>
        ["pending", "approved"].includes(f)
      );
      if (statusFilters.length > 0) {
        query.status = { $in: statusFilters };
      }

      // Filter for payment
      const paymentFilters = filterArray.filter((f) =>
        ["paid", "notpaid"].includes(f)
      );
      if (paymentFilters.length > 0) {
        query.payment = { $in: paymentFilters };
      }
    }

    const bookings = await Bookform.find(query).sort(sortOptions[sort] || {});
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/driver/history", async (req, res) => {
  try {
    const { sort } = req.query;

    const sortOptions = {
      "date-desc": { datetime: -1 },
      "date-asc": { datetime: 1 },
    };
    const bookings = await Bookform.find({
      status: "completed" || "cancelled",
    }).sort(sortOptions[sort]);
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/rider/history", verifyToken, async (req, res) => {
  try {
    const { sort } = req.query;
    const sortOptions = {
      "date-desc": { datetime: -1 },
      "date-asc": { datetime: 1 },
    };
    const email = req.user.email;
    const query = {
      email,
      status: { $in: ["completed", "cancelled"] },
    };
    const bookings = await Bookform.find(query).sort(sortOptions[sort]);
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});
router.get("/rider/transaction", verifyToken, async (req, res) => {
  try {
    const { sort } = req.query;
    const sortOptions = {
      "date-desc": { datetime: -1 },
      "date-asc": { datetime: 1 },
    };
    const email = req.user.email;
    const query = {
      email,
      status: { $in: ["completed", "cancelled"] },
    };
    const bookings = await Bookform.find(query).sort(sortOptions[sort]);
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.patch("/approve/:id", async (req, res) => {
  try {
    const booking = await Bookform.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking approved", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve booking" });
  }
});
router.patch("/isready/:id", async (req, res) => {
  try {
    const booking = await Bookform.findByIdAndUpdate(
      req.params.id,
      { ready: "isready" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking approved", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve booking" });
  }
});
router.patch("/ready/:id", async (req, res) => {
  try {
    const booking = await Bookform.findByIdAndUpdate(
      req.params.id,
      { ready: "ready" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking approved", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve booking" });
  }
});

router.patch("/pay/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Bookform.findByIdAndUpdate(
      req.params.id,
      {
        payment: "paid",
        status: "completed",
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking marked as paid", booking });
  } catch (err) {
    console.error("Error updating booking to paid:", err);
    res.status(500).json({ error: "Failed to mark booking as paid" });
  }
});

module.exports = router;
