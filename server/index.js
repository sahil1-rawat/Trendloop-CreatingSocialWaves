import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import connectDB from './database/db.js';
import userRoutes from './routes/userRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import AdminRoutes from './routes/admitRouter.js';
import { Server } from 'socket.io';
import http from 'http';
import setupSocket from './socket/socket.js';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const app = express();
const port = process.env.PORT || 7000;

const allowedOrigins = [
  'https://trendloop-waves.vercel.app',
  process.env.ORIGIN,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send(`Server is working on ${port}`);
});

app.use('/api/auth', AuthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', AdminRoutes);

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
  connectDB();
});

setupSocket(server);
