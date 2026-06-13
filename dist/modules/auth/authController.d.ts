import { Request, Response } from 'express';
declare const signUpController: (req: Request, res: Response) => Promise<void>;
declare const loginController: (req: Request, res: Response) => Promise<void>;
declare const googleLoginController: (req: Request, res: Response) => Promise<void>;
export { signUpController, loginController, googleLoginController };
