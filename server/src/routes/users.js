const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // Generate a new password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the user to the database
    const user = await newUser.save();
    res.status(201).json({ _id: user._id }); // 201 Created status for successful registration
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json("Wrong username or password");
    }

    // Validate the password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json("Wrong username or password");
    }

    // Send a response with user information
    res.status(200).json({ _id: user._id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
