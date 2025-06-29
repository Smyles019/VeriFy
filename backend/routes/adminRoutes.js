import express from 'express';
import User from '../models/User.js';


const router = express.Router()
// GET admin stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClaims = await Claim.countDocuments();

    const roleCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const usersByRole = roleCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      totalUsers,
      totalClaims,
      reporters: usersByRole.reporter || 0,
      factCheckers: usersByRole["fact-checker"] || 0,
    });
  } catch (err) {
    console.error("Failed to fetch admin stats:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});


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



router.get('/claims', async (req, res) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    console.error("Failed to fetch claims:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE a claim
router.delete('/claims/:id', async (req, res) => {
  try {
    await Claim.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error("Failed to delete claim:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ASSIGN a claim to a fact-checker (basic example)
router.put('/claims/:id/assign', async (req, res) => {
  try {
    const { assignedTo } = req.body; // e.g., userId
    const updatedClaim = await Claim.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    );
    res.json(updatedClaim);
  } catch (err) {
    console.error("Failed to assign claim:", err);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
