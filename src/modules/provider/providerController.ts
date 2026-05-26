import { Request, Response } from 'express';
import { providerInfo, providerInfoUpdate } from './providerService';
import sendResponse from '../../utils/sendResponse';

const providerInfoController = async (req: Request, res: Response) => {
  try {
    const providerId = req.user.id;
    console.log('Provider ID:', providerId);
    const providerData = await providerInfo(providerId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: providerData,
      message: 'Provider information successfully',
    });
  } catch (error: any) {
    console.log(error.message);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      data: null,
      message: 'Failed to provider information',
    });
  }
};

const providerInfoUpdateController = async (req: Request, res: Response) => {
  try {
    const providerId = req.user.id;
    const updateData = req.body;
    const providerData = await providerInfoUpdate(providerId, updateData);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: providerData,
      message: 'Provider information updated successfully',
    });
  } catch (error: any) {
    console.log(error.message);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      data: null,
      message: 'Failed to update provider information',
    });
  }
};

export { providerInfoController, providerInfoUpdateController };
