import express from 'express';
const router = express.Router();
// internal imports
import { createRequestController } from './requestController';
import { authMiddleware } from '../../middlewares/authMiddleware';

// Define routes
router.post('/', authMiddleware, createRequestController);

export default router;
