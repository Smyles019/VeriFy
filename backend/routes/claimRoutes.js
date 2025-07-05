import express from 'express';
import multer from 'multer';
import { createClaim, getMyClaims, getAllClaims, getClaimById, reviewClaim} from '../controllers/claimController.js';
import { protect } from '../middleware/authMiddleware.js';

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

// In claimRoutes.js
router.put('/claims/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error });
  }
});


export default router;
