import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js"; // Use .js extension in ES Modules

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
