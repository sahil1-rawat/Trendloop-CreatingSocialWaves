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
import { Server } from 'socket.io';
import http from 'http';
import { app, server } from './socket/socket.js';

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});
// const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

app.get('/', (req, res) => {
  res.send(`Server is working on ${port}`);
});
app.use('/api/auth', AuthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/messages', messageRoutes);

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
server.listen(port, () => {
  console.log(`App is running on port ${port}`);
  connectDB();
});
