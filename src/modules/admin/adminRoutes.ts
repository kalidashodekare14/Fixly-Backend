import express from 'express';
import {
  adminOverviewInfoController,
  createCategoriesController,
  usersManageController,
  userStatusChangeController,
} from './adminController';

const router = express.Router();

router.get('/overview', adminOverviewInfoController);
router.get('/manage_user', usersManageController);
router.put('/:id/status_change', userStatusChangeController);
router.post('/categories', createCategoriesController);

export default router;
