import express from 'express';
import { createCategoriesController } from './adminController';

const router = express.Router();

router.post('/categories', createCategoriesController);

export default router;
