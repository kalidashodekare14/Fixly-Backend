import {
  createRequest,
  getRequest,
  requestUpdate,
  deleteRequest,
  getOffersForRequest,
  acceptOffer,
  selectedProvider,
  viewOpenRequest,
  viewSelectedOfferForRequest,
  overviewInfo,
  sslcommerzPayment,
  paymentSuccessAndStatusChange,
  getMyPaymentHistory,
} from './requestService';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { config } from '../../config/env';
import Payment from '../../models/payment';

const overviewInfoController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const result = await overviewInfo(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Overivew info get successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

const createRequestController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming user ID is available in req.user
    let location = null;
    if (req.body.location) {
      location = JSON.parse(req.body.location);
    }

    console.log('checking request id', req.body.providerId);

    const requestData = {
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      deadline: req.body.deadline,
      location,
      image: req.file?.path,
      providerId: req.body.providerId,
      requestType: req.body.requestType,
    };

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
    const userId = req.user.id;
    const request = await getRequest(userId);
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

const viewSelectedOfferForRequestController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user.id;
    const request = await viewSelectedOfferForRequest(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Request with selected offer retrieved successfully',
      data: request,
    });
  } catch (error) {
    console.error('Error retrieving request with selected offer:', error);
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
    let location = null;
    if (req.body.location) {
      location = JSON.parse(req.body.location);
    }

    const updateData = {
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      deadline: req.body.deadline,
      location,
      image: req.file?.path,
    };

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

const deleteRequestController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    await deleteRequest(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Request deleted successfully',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

const viewOpenRequestController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const request = await viewOpenRequest(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Open requests retrieved successfully',
      data: request,
    });
  } catch (error) {
    console.error('Error retrieving open requests:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

const getOffersForRequestController = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.requestId.toString();
    const offers = await getOffersForRequest(requestId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Offers fetched successfully',
      data: offers,
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

const getSelectedProviderController = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.requestId.toString();
    const offers = await selectedProvider(requestId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Accepted offers fetched successfully',
      data: offers,
    });
  } catch (error) {
    console.error('Error fetching accepted offers:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

const acceptOfferController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const offerId = req.params.offerId.toString();
    await acceptOffer(userId, offerId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Offer accepted successfully',
      data: null,
    });
  } catch (error) {
    console.error('Error accepting offer:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

const sslcommerzPaymentController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id.toString();
    const paymentInfo = req.body;
    const result = await sslcommerzPayment(userId, paymentInfo);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Offer accepted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error accepting offer:', error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Internal server error',
      data: null,
    });
  }
};

const paymentSuccessController = async (req: Request, res: Response) => {
  try {
    const paymentId = req.body.value_a;

    await paymentSuccessAndStatusChange(paymentId);

    res.redirect(`${config.FRONTEND_URL}/payment-success`);
  } catch (error) {
    res.redirect(`${config.FRONTEND_URL}/payment-failed`);
  }
};

const paymentFailController = async (req: Request, res: Response) => {
  try {
    const paymentId = req.body.value_a;

    if (paymentId) {
      await Payment.findByIdAndUpdate(paymentId, {
        status: 'failed',
      });
    }

    return res.redirect(`${config.FRONTEND_URL}/payment-failed`);
  } catch (error) {
    console.error('Payment fail error:', error);

    return res.redirect(`${config.FRONTEND_URL}/payment-failed`);
  }
};

const paymentCancelController = async (req: Request, res: Response) => {
  try {
    const paymentId = req.body.value_a;

    if (paymentId) {
      await Payment.findByIdAndUpdate(paymentId, {
        status: 'cancelled',
      });
    }

    return res.redirect(`${config.FRONTEND_URL}/payment-cancelled`);
  } catch (error) {
    console.error('Payment cancel error:', error);

    return res.redirect(`${config.FRONTEND_URL}/payment-cancelled`);
  }
};

const getMyPaymentHistoryController = async (req: any, res: any) => {
  try {
    const payments = await getMyPaymentHistory(req.user.id, req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Payment history fetched successfully',
      data: payments,
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

export {
  overviewInfoController,
  createRequestController,
  getRequestController,
  updateRequestController,
  deleteRequestController,
  getOffersForRequestController,
  acceptOfferController,
  getSelectedProviderController,
  viewOpenRequestController,
  viewSelectedOfferForRequestController,
  sslcommerzPaymentController,
  paymentSuccessController,
  paymentFailController,
  paymentCancelController,
  getMyPaymentHistoryController,
};
