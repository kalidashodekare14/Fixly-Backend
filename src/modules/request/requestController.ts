import { createRequest, getRequest, requestUpdate } from './requestService';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';

const createRequestController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming user ID is available in req.user
    const requestData = req.body;
    const { request, offers } = await createRequest(userId, requestData);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Request created successfully',
      data: { request, offers },
    });
  } catch (error) {
    console.error('Error creating request:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

const getRequestController = async (req: Request, res: Response) => {
  try {
    const requestId = req.user.id;
    const request = await getRequest(requestId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Request retrieved successfully',
      data: request,
    });
  } catch (error) {
    console.error('Error retrieving request:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

const updateRequestController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    const updatedRequest = await requestUpdate(userId, updateData);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Request updated successfully',
      data: updatedRequest,
    });
  } catch (error) {
    console.error('Error updating request:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

export {
  createRequestController,
  getRequestController,
  updateRequestController,
};
