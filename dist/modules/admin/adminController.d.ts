import { Request, Response } from 'express';
declare const adminOverviewInfoController: (req: Request, res: Response) => Promise<void>;
declare const usersManageController: (req: Request, res: Response) => Promise<void>;
declare const userStatusChangeController: (req: Request, res: Response) => Promise<void>;
declare const requestsManageController: (req: Request, res: Response) => Promise<void>;
declare const reviewsManageController: (req: Request, res: Response) => Promise<void>;
declare const paymentsManageController: (req: Request, res: Response) => Promise<void>;
declare const createCategoriesController: (req: Request, res: Response) => Promise<void>;
export { adminOverviewInfoController, usersManageController, userStatusChangeController, requestsManageController, paymentsManageController, reviewsManageController, createCategoriesController, };
