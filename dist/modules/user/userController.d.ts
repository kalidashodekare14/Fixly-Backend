import { Request, Response } from 'express';
declare const getMyProfileController: (req: Request, res: Response) => Promise<void>;
declare const userInfoController: (req: Request, res: Response) => Promise<void>;
declare const updateUserInfoController: (req: Request, res: Response) => Promise<void>;
export { getMyProfileController, userInfoController, updateUserInfoController };
