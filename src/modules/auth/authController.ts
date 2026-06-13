import { Request, Response } from 'express';
import { registerUser, loginUser, googleLogin } from './authService';
import sendResponse from '../../utils/sendResponse';

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

const googleLoginController = async (req: Request, res: Response) => {
  try {
    const result = await googleLogin(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Google login successful',
      data: result,
    });
  } catch (error) {
    console.error('Google login error:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

export { signUpController, loginController, googleLoginController };
