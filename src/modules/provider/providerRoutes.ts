import express from 'express';
const router = express.Router();
import {
  providerInfoController,
  providerInfoUpdateController,
  requestInfoController,
  offerCreateController,
  sendOfferedInfoController,
  providerJobsInfoController,
  jobsStatusChangeController,
  overviewInfoController,
  getProviderReviewsController,
  getProviderPaymentHistoryController,
} from './providerController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { upload } from '../../config/multerStorage';

router.get('/provider_overview', authMiddleware, overviewInfoController);
router.get('/', authMiddleware, providerInfoController);
router.put(
  '/',
  authMiddleware,
  upload.single('image'),
  providerInfoUpdateController,
);
router.get('/requests', authMiddleware, requestInfoController);
router.put('/offer', authMiddleware, offerCreateController);
router.get('/send_offered', authMiddleware, sendOfferedInfoController);
router.get('/jobs', authMiddleware, providerJobsInfoController);
router.put('/job_status', authMiddleware, jobsStatusChangeController);
router.get('/provider-reviews', authMiddleware, getProviderReviewsController);
router.get(
  '/provider_payments',
  authMiddleware,
  getProviderPaymentHistoryController,
);

export default router;
