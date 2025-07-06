import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import ReaderApplication from "../models/ReaderApplication.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { sendStatusEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.post(
  "/reader",
  protect,
  upload.single("document"),
  async (req, res) => {
    const userId = req.user.id;
    const { message } = req.body;

    try {
      const existing = await ReaderApplication.findOne({ user: userId, status: "pending" });
      if (existing) {
        return res.status(400).json({ message: "You already have a pending application." });
      }

      const application = new ReaderApplication({
        user: userId,
        message,
        status: "pending",
        createdAt: new Date(),
        document: req.file ? `uploads/documents/${req.file.filename}` : null
      });

      await application.save();
      res.status(201).json({ message: "Application submitted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get('/reader', protect, isAdmin, async (req, res) => {
  try {
    const applications = await ReaderApplication.find()
      .populate('user', 'firstName lastName email phone role'); // ✅ include all needed fields

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/reader/:id/status', protect, isAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: "Invalid status" });

  try {
    const application = await ReaderApplication.findById(req.params.id).populate('user');
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await application.save();

     if (application.user?.email) {
      await sendStatusEmail(application.user.email, status);
    }

    res.json({ message: `Application ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/my-applications', protect, async (req, res) => {
  const apps = await ReaderApplication.find({ user: req.user._id });
  res.json(apps);
});



export default router;
