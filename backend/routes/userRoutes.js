import express from 'express';
import {
  getCurrentUser,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  uploadProfilePic,
  authenticate,
  upload,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authenticate, getCurrentUser);
router.put('/me', authenticate, updateUserProfile);
router.post('/upload-profile-pic', authenticate, upload.single('profilePic'), uploadProfilePic);

// ======= Admin/Management Routes =======
router.get('/', authenticate, getAllUsers);
router.put('/:id/role', authenticate, updateUserRole);
router.delete('/:id', authenticate, deleteUser);

export default router;
