import Article from '../models/Article.js';
import User from '../models/User.js';

export const likeArticle = async (req, res) => {
  const userId = req.user._id;
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: 'Article not found' });

  // Remove from dislikes if present
  article.dislikes = article.dislikes.filter(id => id.toString() !== userId.toString());

  if (article.likes.includes(userId)) {
    // Unlike
    article.likes = article.likes.filter(id => id.toString() !== userId.toString());
  } else {
    article.likes.push(userId);
  }

  await article.save();
  res.json({ likes: article.likes.length, dislikes: article.dislikes.length });
};

export const dislikeArticle = async (req, res) => {
  const userId = req.user._id;
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: 'Article not found' });

  // Fix: Initialize arrays if missing
  article.likes = article.likes || [];
  article.dislikes = article.dislikes || [];

  // Remove like if present
  article.likes = article.likes.filter(id => id.toString() !== userId.toString());

  // Toggle dislike
  if (article.dislikes.includes(userId)) {
    article.dislikes = article.dislikes.filter(id => id.toString() !== userId.toString());
  } else {
    article.dislikes.push(userId);
  }

  await article.save();
  res.json({ likes: article.likes.length, dislikes: article.dislikes.length });
};

export const flagArticle = async (req, res) => {
  const userId = req.user._id;
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: 'Article not found' });
  
  article.flags = article.flags || [];

  if (article.flags.includes(userId)) {
    // Unflag
    article.flags = article.flags.filter(id => id.toString() !== userId.toString());
    await article.save();
    return res.json({ flagged: false });
  } else {
    article.flags.push(userId);
    await article.save();
    return res.json({ flagged: true, flagCount: article.flags.length});
  }
  
};

export const addCommentToArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const comment = {
      user: req.user._id,
      text: req.body.text,
    };

    article.comments.push(comment);
    await article.save();

    const populatedComment = await article.populate({
      path: "comments.user",
      select: "firstName lastName",
    });

    res.status(201).json(populatedComment.comments.at(-1)); // send latest comment
  } catch (err) {
    console.error("Error in addCommentToArticle:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

export const getArticleComments = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("comments.user", "firstName lastName");

    if (!article) return res.status(404).json({ message: "Article not found" });

    res.status(200).json(article.comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const deleteCommentFromArticle = async (req, res) => {
  const { articleId, commentId } = req.params;
  const userId = req.user._id;

  try {
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const comment = article.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only allow deletion if user owns the comment
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    article.comments.pull({ _id: commentId });
    await article.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFlaggedArticles = async (req, res) => {
  try {
    const flaggedArticles = await Article.aggregate([
      {
        $addFields: {
          flagCount: { $size: { $ifNull: ["$flags", []] } }
        }
      },
      {
        $match: {
          flagCount: { $gt: 0 }
        }
      },
      {
        $sort: { flagCount: -1, createdAt: -1 } // Sort by flag count descending, then newest
      }
    ]);

    res.json(flaggedArticles);
  } catch (err) {
    console.error('Failed to fetch flagged articles:', err);
    res.status(500).json({ message: 'Server error fetching flagged articles' });
  }
};

