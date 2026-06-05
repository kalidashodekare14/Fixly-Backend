import {
  getCategories,
  providerPublicProfile,
  publicService,
} from './publicService';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';

const publicServiceController = async (req: Request, res: Response) => {
  try {
    const providers = await publicService(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: providers,
      message: 'Providers fetched successfully',
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Error fetching providers',
      data: null,
    });
  }
};

const providerPublicProfileController = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id.toString();
    const provider = await providerPublicProfile(providerId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: provider,
      message: 'Provider profile fetched successfully',
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Error fetching provider profile',
      data: null,
    });
  }
};

const getCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: categories,
      message: 'categories data fetched successfully',
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: `Error fetching categories data: ${error?.messsage}`,
      data: null,
    });
  }
};

export {
  publicServiceController,
  providerPublicProfileController,
  getCategoriesController,
};
