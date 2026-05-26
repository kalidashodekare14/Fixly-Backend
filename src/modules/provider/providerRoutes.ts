import express from 'express';
const router = express.Router();
import {
  providerInfoController,
  providerInfoUpdateController,
} from './providerController';
import { authMiddleware } from '../../middlewares/authMiddleware';

router.get('/', authMiddleware, providerInfoController);
router.put('/', authMiddleware, providerInfoUpdateController);

export default router;
