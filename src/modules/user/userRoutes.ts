import express from 'express';
const router = express.Router();
// Auth Middleware
import { authMiddleware } from '../../middlewares/authMiddleware';
// Controllers
import { userInfoController, updateUserInfoController } from './userController';

// Routes
router.get('/', authMiddleware, userInfoController);
router.put('/', authMiddleware, updateUserInfoController);

export default router;
