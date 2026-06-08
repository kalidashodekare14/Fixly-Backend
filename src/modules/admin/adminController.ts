import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { adminOverviewInfo, createCategories } from './adminService';

const adminOverviewInfoController = async (req: Request, res: Response) => {
  try {
    const result = await adminOverviewInfo();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Overview info get successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Failed to overview info',
    });
  }
};

const createCategoriesController = async (req: Request, res: Response) => {
  try {
    const result = await createCategories(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Categories created successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Failed to create categories',
    });
  }
};

export { adminOverviewInfoController, createCategoriesController };
