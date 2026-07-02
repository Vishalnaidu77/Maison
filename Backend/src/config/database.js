import mongoose from "mongoose";
import { config } from "./config.js";
import dns from 'dns'

export const connectDB = async () => {
  try {
    dns.setServers(['1.1.1.1', '8.8.8.8'])
    const connection = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};