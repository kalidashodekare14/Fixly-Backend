const express = require('express');
const router = express.Router();
// Auth Middleware
import { authMiddleware } from '../../middlewares/authMiddleware';
// Controllers
import { userInfoController } from './userController';

// Routes
router.get('/', authMiddleware, userInfoController);

export default router;
