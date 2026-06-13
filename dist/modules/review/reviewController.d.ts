import { Request, Response } from 'express';
declare const createReviewController: (req: Request, res: Response) => Promise<void>;
declare const getMyReviewsController: (req: Request, res: Response) => Promise<void>;
declare const updateReviewController: (req: any, res: any) => Promise<void>;
export { createReviewController, getMyReviewsController, updateReviewController, };
