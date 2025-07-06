import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import {
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";


const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Register route working!");
});


router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, phone, password, role } = req.body;

     const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ firstName, lastName, username, email, phone, password: hashedPassword, role: role || "reader" }); // Default role is 'reader'

  
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

     const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "yourSecretKey", // Use env variable in prod
      { expiresIn: "1d" }
    );

    // Return user + token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role, // This is what frontend uses to redirect
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`, 
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;
