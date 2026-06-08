import express from 'express';
import {
  adminOverviewInfoController,
  createCategoriesController,
} from './adminController';

const router = express.Router();

router.get('/overview', adminOverviewInfoController);
router.post('/categories', createCategoriesController);

export default router;
