import express from 'express';
const router = express.Router();
// internal imports
import {
  createRequestController,
  getRequestController,
  updateRequestController,
  deleteRequestController,
  getOffersForRequestController,
  acceptOfferController,
} from './requestController';
import { authMiddleware } from '../../middlewares/authMiddleware';

// Define routes
router.post('/', authMiddleware, createRequestController);
router.get('/', authMiddleware, getRequestController);
router.put('/', authMiddleware, updateRequestController);
router.delete('/', authMiddleware, deleteRequestController);
router.get('/:requestId/offers', authMiddleware, getOffersForRequestController);
router.put('/offers/:offerId/accept', authMiddleware, acceptOfferController);

export default router;
