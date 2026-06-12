import express from 'express';
import {
  adminOverviewInfoController,
  createCategoriesController,
  paymentsManageController,
  requestsManageController,
  reviewsManageController,
  usersManageController,
  userStatusChangeController,
} from './adminController';

const router = express.Router();

router.get('/overview', adminOverviewInfoController);
router.get('/manage_user', usersManageController);
router.put('/:id/status_change', userStatusChangeController);
router.get('/manage_requests', requestsManageController);
router.get('/manage_payments', paymentsManageController);
router.get('/manage_reviews', reviewsManageController);
router.post('/categories', createCategoriesController);

export default router;
