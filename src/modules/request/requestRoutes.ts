import express from 'express';
const router = express.Router();
// internal imports
import {
  createRequestController,
  getRequestController,
  updateRequestController,
} from './requestController';
import { authMiddleware } from '../../middlewares/authMiddleware';

// Define routes
router.post('/', authMiddleware, createRequestController);
router.get('/', authMiddleware, getRequestController);
router.put('/', authMiddleware, updateRequestController);

export default router;
