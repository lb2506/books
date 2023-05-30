const User = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    
    await user.save();
    const token = jwt.sign({ _id: user._id.toString(), role: user.role, readingList: user.readingList }, process.env.CRET_KEY);
    res.status(201).send({user, token});
    console.log(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;