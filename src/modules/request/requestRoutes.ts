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
  getSelectedProviderController,
  viewOpenRequestController,
  viewSelectedOfferForRequestController,
  overviewInfoController,
  sslcommerzPaymentController,
  paymentSuccessController,
  paymentFailController,
  paymentCancelController,
  getMyPaymentHistoryController,
} from './requestController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { upload } from '../../config/multerStorage';

// Define routes

router.get('/user_overivew', authMiddleware, overviewInfoController);

router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  createRequestController,
);
router.get('/', authMiddleware, getRequestController);
router.put(
  '/',
  authMiddleware,
  upload.single('image'),
  updateRequestController,
);
router.delete('/', authMiddleware, deleteRequestController);

router.get('/open_requests', authMiddleware, viewOpenRequestController);
router.get(
  '/selected_offer',
  authMiddleware,
  viewSelectedOfferForRequestController,
);

// accept offer and get offers for request
router.get(
  '/:requestId/selected_provider',
  authMiddleware,
  getSelectedProviderController,
);
router.get('/:requestId/offers', authMiddleware, getOffersForRequestController);
router.put('/offers/:offerId/accept', authMiddleware, acceptOfferController);
router.post('/ssl_payment', authMiddleware, sslcommerzPaymentController);
router.post('/payment_success', paymentSuccessController);
router.post('/payments_fail', paymentFailController);
router.post('/payments_cancel', paymentCancelController);
// payment history
router.get('/my-payments', authMiddleware, getMyPaymentHistoryController);

export default router;
