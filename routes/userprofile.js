const express = require('express');
const router = express.Router();
const UserProfile = require('../models/BookForm');

router.post('/', async (req, res) => {
  try {
    // const existing = await UserProfile.findOne((u)=>u.email ===req.body.email);
    // if (existing) {
    //   return res.status(400).json({ message: 'Profile already exists' });
    // }

    const newProfile = new UserProfile(req.body);
    await newProfile.save();
    res.status(201).json({ message: 'Profile saved successfully' });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'Failed to save profile' });
  }
});

router.get('/', async (req, res) => {
  try {
    const profile = await UserProfile.find(); 
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;