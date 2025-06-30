// routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCurrentUser, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateUserProfile)

export default router;
