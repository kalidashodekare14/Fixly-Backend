import express from 'express';
import {
  getCategoriesController,
  providerPublicProfileController,
  publicServiceController,
} from './publicController';

const router = express.Router();

router.get('/categories', getCategoriesController);
router.get('/', publicServiceController);
router.get('/:id', providerPublicProfileController);

export default router;
