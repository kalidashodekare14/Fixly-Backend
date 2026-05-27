import express from 'express';
const router = express.Router();
// Auth Middleware
import { authMiddleware } from '../../middlewares/authMiddleware';
// Controllers
import { userInfoController, updateUserInfoController } from './userController';
import { upload } from '../../config/multerStorage';

// Routes
router.get('/', authMiddleware, userInfoController);
router.put(
  '/',
  authMiddleware,
  upload.single('image'),
  updateUserInfoController,
);

export default router;
