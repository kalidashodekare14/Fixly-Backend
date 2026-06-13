import { Request, Response } from 'express';
import {
  offerCreate,
  offeredInfo,
  providerInfo,
  providerInfoUpdate,
  providerJobsInfo,
  requestInfo,
  jobStatusChange,
  overviewInfo,
  getProviderReviews,
  getProviderPaymentHistory,
} from './providerService';
import sendResponse from '../../utils/sendResponse';

const overviewInfoController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await overviewInfo(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: result,
      message: 'Overview information get successfully',
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      data: null,
      message: 'Failed to overview information',
    });
  }
};

const providerInfoController = async (req: Request, res: Response) => {
  try {
    const providerId = req.user.id;
    const providerData = await providerInfo(providerId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: providerData,
      message: 'Provider information successfully',
    });
  } catch (error: any) {
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

    const parsedLocation = JSON.parse(req.body.location);

    const location = {
      ...parsedLocation,
      coordinates: parsedLocation.coordinates.map(Number),
    };

    const updateData = {
      ...req.body,
      availableStatus: req.body.availableStatus === 'true',
      location,
    };

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
    sendResponse(res, {
      statusCode: 500,
      success: false,
      data: null,
      message: 'Failed to create/update offer',
    });
  }
};

const sendOfferedInfoController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const offeredData = await offeredInfo(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: offeredData,
      message: 'Request information retrieved successfully',
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      data: null,
      message: 'Failed to retrieve request information',
    });
  }
};

const providerJobsInfoController = async (req: Request, res: Response) => {
  try {
    const providerId = req.user.id;
    const providerData = await providerJobsInfo(providerId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: providerData,
      message: 'Provider Jobs information successfully',
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      data: null,
      message: 'Failed to provider jobs information',
    });
  }
};

const jobsStatusChangeController = async (req: Request, res: Response) => {
  try {
    const providerId = req.user.id;
    const jobData = req.body;
    const providerData = await jobStatusChange(providerId, jobData);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: providerData,
      message: 'Job status change successfully',
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      data: null,
      message: 'Job status change failed',
    });
  }
};

const getProviderReviewsController = async (req: any, res: any) => {
  try {
    const reviews = await getProviderReviews(req.user.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Provider reviews fetched successfully',
      data: reviews,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getProviderPaymentHistoryController = async (req: any, res: any) => {
  try {
    const data = await getProviderPaymentHistory(req.user.id, req.query);

    res.status(200).json({
      success: true,
      message: 'Provider payment history fetched',
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  overviewInfoController,
  providerInfoController,
  providerInfoUpdateController,
  requestInfoController,
  offerCreateController,
  sendOfferedInfoController,
  providerJobsInfoController,
  jobsStatusChangeController,
  getProviderReviewsController,
  getProviderPaymentHistoryController,
};
