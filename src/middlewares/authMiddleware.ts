import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/env';
import sendResponse from '../utils/sendResponse';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: 'Unauthorized',
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    req.user = {
      id: (decoded as JwtPayload).id as string,
    };
    next();
  } catch (_error) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: 'Invalid token',
    });
  }
};
