import { Request, Response } from 'express';
import {
  offerCreate,
  providerInfo,
  providerInfoUpdate,
  requestInfo,
} from './providerService';
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
    const userId = req.user.id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const providerData = await providerInfoUpdate(userId, updateData);
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

const requestInfoController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const offerData = await requestInfo(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: offerData,
      message: 'Request information retrieved successfully',
    });
  } catch (error: any) {
    console.log(error.message);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      data: null,
      message: 'Failed to retrieve request information',
    });
  }
};

const offerCreateController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const offerData = await offerCreate(userId, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: offerData,
      message: 'Offer created/updated successfully',
    });
  } catch (error: any) {
    console.log(error.message);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      data: null,
      message: 'Failed to create/update offer',
    });
  }
};

export {
  providerInfoController,
  providerInfoUpdateController,
  requestInfoController,
  offerCreateController,
};
