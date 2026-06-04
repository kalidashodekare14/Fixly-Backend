import { providerPublicProfile, publicService } from './publicService';
import sendResponse from '../../utils/sendResponse';

const publicServiceController = async (req: any, res: any) => {
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

const providerPublicProfileController = async (req: any, res: any) => {
  try {
    const provider = await providerPublicProfile(req.params.id);
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

export { publicServiceController, providerPublicProfileController };
