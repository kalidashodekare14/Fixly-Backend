import { Request, Response } from 'express';
import { userInfo } from './userService';
import sendResponse from '../../utils/sendResponse';

const userInfoController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await userInfo(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User information retrieved successfully',
      data: user,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: (error as Error).message,
    });
  }
};

export { userInfoController };
