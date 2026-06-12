import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import {
  adminOverviewInfo,
  createCategories,
  paymentsManage,
  requestsManage,
  usersManage,
  userStatusChange,
} from './adminService';

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

const usersManageController = async (req: Request, res: Response) => {
  try {
    const result = await usersManage(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Manage users successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Failed to manage users',
    });
  }
};

const userStatusChangeController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id.toString();
    const statusData = req.body;
    const result = await userStatusChange(userId, statusData);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Manage status change successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Failed to manage status change',
    });
  }
};

const requestsManageController = async (req: Request, res: Response) => {
  try {
    const result = await requestsManage(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Manage requests successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Failed to manage requests',
    });
  }
};

const paymentsManageController = async (req: Request, res: Response) => {
  try {
    const result = await paymentsManage(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Manage payments successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Failed to manage payments',
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

export {
  adminOverviewInfoController,
  usersManageController,
  userStatusChangeController,
  requestsManageController,
  paymentsManageController,
  createCategoriesController,
};
