import express from 'express';
const router = express.Router();
// Auth Middleware
import { authMiddleware } from '../../middlewares/authMiddleware';
// Controllers
import {
  userInfoController,
  updateUserInfoController,
  getMyProfileController,
} from './userController';
import { upload } from '../../config/multerStorage';

// Routes
router.get('/me', authMiddleware, getMyProfileController);
router.get('/', authMiddleware, userInfoController);
router.put(
  '/',
  authMiddleware,
  upload.single('image'),
  updateUserInfoController,
);

export default router;
