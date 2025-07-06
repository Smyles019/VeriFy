import express from 'express';
import {
  getCurrentUser,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  uploadProfilePic,
  authenticate,
} from '../controllers/userController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });


router.get('/me', authenticate, getCurrentUser);
router.put('/me', authenticate, updateUserProfile);
router.post('/upload-profile-pic', authenticate, upload.single('profilePic'), uploadProfilePic);

// ======= Admin/Management Routes =======
router.get('/', authenticate, getAllUsers);
router.put('/:id/role', authenticate, updateUserRole);
router.delete('/:id', authenticate, deleteUser);

export default router;
