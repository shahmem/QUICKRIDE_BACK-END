const express = require('express');
const router = express.Router();
const Profile = require('../models/DriverProfile');
const multer = require('multer');
const path = require('path');
const verifyToken = require("../middleware/authMiddleware");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
}); 
const upload = multer({ storage }); 

router.post('/',verifyToken, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'licenseImg', maxCount: 1 },
  { name: 'rcImg', maxCount: 1 },
  { name: 'insurance', maxCount: 1 },
]), async (req, res) => {
  try {
    const email = req.user.email;
    const existing = await Profile.findOne({email});
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const newProfile = new Profile({
      ...req.body,
      photo: req.files['photo']?.[0]?.path,
      licenseImg: req.files['licenseImg']?.[0]?.path,
      rcImg: req.files['rcImg']?.[0]?.path,
      insurance: req.files['insurance']?.[0]?.path,
    });

    await newProfile.save();
    res.status(201).json({ message: 'Profile saved successfully' });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'Failed to save profile' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    // console.log("Decoded User:", req.user); 
    const email = req.user.email
    const profile = await Profile.findOne({ email });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    // console.log("get success :",profile);
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/',verifyToken, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'licenseImg', maxCount: 1 },
  { name: 'rcImg', maxCount: 1 },
  { name: 'insurance', maxCount: 1 },
]), async (req, res) => {
  try {
    const profile = await Profile.findOne({email: req.user.email });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update fields
    const updatedData = {
      ...req.body,
    };
    if (req.files['photo']) updatedData.photo = req.files['photo'][0].path;
    if (req.files['licenseImg']) updatedData.licenseImg = req.files['licenseImg'][0].path;
    if (req.files['rcImg']) updatedData.rcImg = req.files['rcImg'][0].path;
    if (req.files['insurance']) updatedData.insurance = req.files['insurance'][0].path;

    const updatedProfile = await Profile.findByIdAndUpdate(profile._id, updatedData, { new: true });

    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;