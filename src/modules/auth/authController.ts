import { Request, Response } from 'express';
import { registerUser, loginUser } from './authService';
import sendResponse from '../../utils/sendResponse';

// Controller for user registration
const signUpController = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Sign up successful',
      data: result,
    });
  } catch (error) {
    console.error('Sign up error:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

// Controller for user login
const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

export { signUpController, loginController };
