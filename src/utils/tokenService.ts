import jwt from 'jsonwebtoken';
import { config } from '../config/env';

const generateToken = (payload: { id: string }) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '1h',
  });
};

export default generateToken;
