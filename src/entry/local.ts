import { config } from '../config/env';
import { connectDB } from '../config/db';
import app from '../app';

const startServer = async () => {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });
};

startServer();
