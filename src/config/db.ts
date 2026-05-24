import mongoose from "mongoose";
import { config } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    if (!config.MONGO_URL) {
      throw new Error("MongoDB Url not imported");
    }
    await mongoose.connect(config.MONGO_URL);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
