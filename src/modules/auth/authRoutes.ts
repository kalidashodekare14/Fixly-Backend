import express from 'express';
const router = express.Router();
import { signUpController, loginController, googleLoginController } from './authController';

router.post('/register', signUpController);
router.post('/login', loginController);
router.post('/google', googleLoginController);

export default router;
