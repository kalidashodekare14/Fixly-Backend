import sendResponse from '../../utils/sendResponse';
import { createReview, getMyReviews, updateReview } from './reviewService';
import { Request, Response } from 'express';

const createReviewController = async (req: Request, res: Response) => {
  try {
    const review = await createReview(req.user.id.toString(), req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Review submitted successfully',
      data: review,
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

const getMyReviewsController = async (req: Request, res: Response) => {
  try {
    const reviews = await getMyReviews(req.user.id.toString());
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Reviews retrieved successfully',
      data: reviews,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

const updateReviewController = async (req: any, res: any) => {
  try {
    const { reviewId } = req.params;

    const review = await updateReview(req.user.id, reviewId, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

export {
  createReviewController,
  getMyReviewsController,
  updateReviewController,
};
