// External dependencies
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

// Internal dependencies
import authRoutes from './modules/auth/authRoutes';
import userRoutes from './modules/user/userRoutes';
import providerRoutes from './modules/provider/providerRoutes';
import requestRoutes from './modules/request/requestRoutes';
import publicRoutes from './modules/public/publicRoutes';
import adminRoutes from './modules/admin/adminRoutes';

// Initialize Express app
const app = express();
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Fixly API is running' });
});

// Routes
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);

  res.status(500).json({ error: 'Internal server error' });
});

// Routes not found handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
