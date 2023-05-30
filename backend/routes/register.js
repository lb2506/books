const User = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  try {

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(401).send({ error: 'Cette adresse mail est déjà utilisée.' });
    } else {

      const user = new User(req.body);

      await user.save();
      const token = jwt.sign({ _id: user._id.toString(), role: user.role, readingList: user.readingList }, process.env.JWT_SECRET_KEY);
      res.send({ user, token });
    }

  } catch (error) {
    res.status(401).send(error);
  }
});


module.exports = router;