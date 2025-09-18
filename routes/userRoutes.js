const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("form");
});

router.post("/users", async (req, res) => {
  try {
    const { username, email, dob } = req.body;
    await User.create({ username, email, dob });
    res.send("🎉 User saved successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = router;
