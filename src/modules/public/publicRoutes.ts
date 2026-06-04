import express from 'express';
import {
  providerPublicProfileController,
  publicServiceController,
} from './publicController';

const router = express.Router();

router.get('/', publicServiceController);
router.get('/:id', providerPublicProfileController);

export default router;
