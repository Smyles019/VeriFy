import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js"; // Use .js extension in ES Modules

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
     
    const username = `${firstName} ${lastName}`;
    
    const newUser = new User({
      firstName,
      lastName,
      username:`${firstName} ${lastName}`,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();
    
    console.log("✅ User saved!");
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});


export default router;
