import express from 'express';
const router = express.Router();
import {
  providerInfoController,
  providerInfoUpdateController,
  requestInfoController,
  offerCreateController,
  sendOfferedInfoController,
} from './providerController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { upload } from '../../config/multerStorage';

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

export default router;
