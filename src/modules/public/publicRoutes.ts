import express from 'express';
import { publicServiceController } from './publicController';

const router = express.Router();

router.get('/', publicServiceController);

export default router;
