import express from 'express';
import User from '../models/User.js';
import Article from '../models/Article.js';
import Claim from '../models/Claim.js';


const router = express.Router()

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Don't expose password
    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// PATCH /api/admin/users/:id/role
router.patch("/users/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) return res.status(400).json({ message: "Role is required" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Failed to update role:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch articles', error: err.message });
  }
});

router.get('/claims', async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate({ path: "user", select: "email", strictPopulate: false })
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (err) {
    console.error("Failed to fetch claims:", err);
    res.status(500).json({ message: 'Failed to fetch claims', error: err.message });
  }
});


export default router;
