import express from 'express';
import {
  createReviewController,
  getMyReviewsController,
  updateReviewController,
} from './reviewController';
import { authMiddleware } from '../../middlewares/authMiddleware';
const router = express.Router();

router.post('/', authMiddleware, createReviewController);
router.get('/', authMiddleware, getMyReviewsController);
router.put('/:reviewId', authMiddleware, updateReviewController);

export default router;
