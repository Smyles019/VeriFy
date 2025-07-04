import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// === GET: Current logged-in user's profile ===
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user); // ✅ includes profilePicUrl
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// === PUT: Update user profile ===
export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, profilePicUrl } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        email,
        phone,
        profilePicUrl,
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// === GET: All users (admin panel) ===
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// === PUT: Update user role (admin action) ===
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error });
  }
};

// === DELETE: Remove user (admin action) ===
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// === Multer Storage Config for Profile Pic ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
export const upload = multer({ storage });

// === POST: Upload profile picture ===
export const uploadProfilePic = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const profilePicUrl = `uploads/${req.file.filename}`; // relative path!
 try {
    // ✅ Save to DB so it's persisted
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicUrl },
      { new: true }
    );

  res.status(200).json({ profilePicUrl });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save profile picture', error: err });
  }
};
