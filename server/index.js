import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import connectDB from './database/db.js';
import userRoutes from './routes/userRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
import postRoutes from './routes/postRoutes.js';
// import messageRoutes from './routes/messageRoutes.js';
import { Server } from 'socket.io';
import http from 'http';
import setupSocket from './socket/socket.js';
import messageRoutes from './routes/messageRoutes.js';
import AdminRoutes from './routes/admitRouter.js';
// import { app, server } from './socket/socket.js';

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.get('/', (req, res) => {
  res.send(`Server is working on ${port}`);
});
app.use('/api/auth', AuthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', AdminRoutes);

// io.on('connection', (socket) => {
//   console.log('User is connected', socket.id);
//   socket.on('disconnect', () => {
//     console.log('User disconnected', socket.id);
//   });
//   /* socket.on('sendMessage', (message) => {
//     io.emit('recieveMessage', message);
//   }); */
// }
// );
const server= app.listen(port, () => {
  console.log(`App is running on port ${port}`);
  connectDB();
});
setupSocket(server);
