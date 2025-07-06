// routes/articleActions.js
import express from 'express';
import Article from '../models/Article.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/:id/like', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    const userId = req.user._id.toString();

    // Initialize arrays if undefined
    article.likes = article.likes || [];
    article.dislikes = article.dislikes || [];

    // Remove user from dislikes if there
    article.dislikes = article.dislikes.filter(
      id => id.toString() !== userId
    );

    const alreadyLiked = article.likes.some(
      id => id.toString() === userId
    );

    if (alreadyLiked) {
      article.likes = article.likes.filter(
        id => id.toString() !== userId
      );
    } else {
      article.likes.push(req.user._id);
    }

    await article.save();

    res.status(200).json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likes: article.likes.length,
      dislikes: article.dislikes.length,
    });
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post('/:id/flag', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    const userId = req.user._id.toString();

    // Initialize flags array if undefined
    article.flags = article.flags || [];

    const alreadyFlagged = article.flags.some(
      id => id.toString() === userId
    );

    if (alreadyFlagged) {
      article.flags = article.flags.filter(
        id => id.toString() !== userId
      );
    } else {
      article.flags.push(req.user._id); // ensure it's ObjectId
    }

    await article.save();
    res.json({ flagged: !alreadyFlagged });
  } catch (err) {
    console.error("FLAG ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


export default router;
