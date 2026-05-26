import { createRequest } from './requestService';
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

export { createRequestController };
