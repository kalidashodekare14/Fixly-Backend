import express from 'express';
const router = express.Router();
// Import controllers
import { signUpController, loginController } from './authController';

// Define routes
router.post('/register', signUpController);
router.post('/login', loginController);

export default router;
