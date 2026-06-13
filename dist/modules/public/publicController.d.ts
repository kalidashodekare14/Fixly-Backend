import { Request, Response } from 'express';
declare const publicServiceController: (req: Request, res: Response) => Promise<void>;
declare const providerPublicProfileController: (req: Request, res: Response) => Promise<void>;
declare const getCategoriesController: (req: Request, res: Response) => Promise<void>;
export { publicServiceController, providerPublicProfileController, getCategoriesController, };
