import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
dotenv.config();
const app = express();
// CORS: allow frontend to send/receive cookies
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
// Parse cookies
app.use(cookieParser());
// Parse JSON bodies BEFORE the routes so req.body is available
app.use(express.json());
// Serve uploaded files statically
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));
app.use(userRouter);
app.use(postRouter);
app.use(express.static("uploads"));

const start = async () => {
  try {
   const connectDb = await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
start();