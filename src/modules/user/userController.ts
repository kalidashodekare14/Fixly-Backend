import { Request, Response } from 'express';
import { userInfo, updateUserInfo } from './userService';
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

const updateUserInfoController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const user = await updateUserInfo(userId, updateData);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User information updated successfully',
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

export { userInfoController, updateUserInfoController };
