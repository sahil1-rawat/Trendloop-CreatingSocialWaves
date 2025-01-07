import express from 'express';
import {
  getAllMessages,
  getChatMessages,
  sendMessage,
} from '../controller/messageController.js';
import { isAuth } from '../middlewares/isAuth.js';
const messageRoutes = express.Router();
messageRoutes.post('/', isAuth, sendMessage);
messageRoutes.get('/chat', isAuth, getChatMessages);
messageRoutes.get('/:id', isAuth, getAllMessages);
export default messageRoutes;
