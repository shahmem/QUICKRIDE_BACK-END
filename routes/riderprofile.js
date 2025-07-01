const express = require("express");
const router = express.Router();
const RiderProfile = require("../models/RiderProfile");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "rcImg", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // console.log("user",req.user);
      
      const email = req.user.email;
      const existing = await RiderProfile.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      const newRiderProfile = new RiderProfile({
        ...req.body,
        rcImg: req.files["rcImg"]?.[0]?.path,
        insurance: req.files["insurance"]?.[0]?.path,
      });

      await newRiderProfile.save();
      res.status(201).json({ message: "Profile saved successfully" });
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ message: "Failed to save profile" });
    }
  }
);

router.get("/", verifyToken, async (req, res) => {
  try {
    // console.log("Decoded User:", req.user);
    const email = req.user.email;
    const profile = await RiderProfile.findOne({ email });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    // console.log("get success :",profile);

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });    
  }
});

module.exports = router;
