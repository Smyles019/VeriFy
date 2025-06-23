import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";


const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Register route working!");
});


router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

     const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ firstName, lastName, email, phone, password: hashedPassword });

  
    await newUser.save();


    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


     const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});


export default router;
