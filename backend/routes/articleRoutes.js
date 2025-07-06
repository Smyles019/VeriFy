import express from 'express';
import {
  likeArticle,
  dislikeArticle,
  flagArticle,
  addCommentToArticle,
  getArticleComments,
  deleteCommentFromArticle,
} from '../controllers/articleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id/like', protect, likeArticle);
router.post('/:id/dislike', protect, dislikeArticle);
router.post('/:id/flag', protect, flagArticle);
router.post('/:id/comments', protect, addCommentToArticle);
router.get('/:id/comments', getArticleComments);
router.delete('/:articleId/comments/:commentId', protect, deleteCommentFromArticle);

export default router;
