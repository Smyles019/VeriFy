import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { createClaim, getMyClaims, getAllClaims, getClaimById, reviewClaim, updateClaimStatus, getArticleById, getClaimByArticleId} from '../controllers/claimController.js';
import { protect } from '../middleware/authMiddleware.js';
import Claim from '../models/Claim.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.get('/', getAllClaims);
router.get('/my-claims', protect, getMyClaims);
router.post('/', protect, upload.single('image'), createClaim);
router.get('/:id', protect, getClaimById);
router.post('/:id/review', protect, upload.single('evidence'), reviewClaim);
router.put('/:id/status', updateClaimStatus);
router.get("/articles/:id", getArticleById);
router.get("/by-article/:id", getClaimByArticleId);
router.get('/article/:articleId', async (req, res) => {
  try {
    const claim = await Claim.findOne({
      article: new mongoose.Types.ObjectId(req.params.articleId),
      status: 'Reviewed'
    }).select('verdict sources');

    if (!claim) return res.status(404).json({ message: 'No reviewed claim found' });

    res.json(claim);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




export default router;
