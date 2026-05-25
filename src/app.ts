// External dependencies
import express, { Request, Response } from 'express';
import cors from 'cors';

// Internal dependencies
import authRoutes from './modules/auth/authRoutes';

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
app.use('/api/auth', authRoutes);

// Global error handler
app.use((err: Error, _req: Request, res: Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Routes not found handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
