import express from 'express';
const router = express.Router();
import {
  providerInfoController,
  providerInfoUpdateController,
  requestInfoController,
  offerCreateController,
} from './providerController';
import { authMiddleware } from '../../middlewares/authMiddleware';

router.get('/', authMiddleware, providerInfoController);
router.put('/', authMiddleware, providerInfoUpdateController);
router.get('/requests', authMiddleware, requestInfoController);
router.put('/offer', authMiddleware, offerCreateController);

export default router;
