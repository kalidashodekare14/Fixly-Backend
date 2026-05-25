import { Request, Response } from 'express';
import { registerUser, loginUser } from './authService';

// Controller for user registration
const signUpController = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    res.status(200).send({
      success: true,
      message: 'Sign up successful',
      data: result,
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Controller for user login
const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).send({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};

export { signUpController, loginController };
