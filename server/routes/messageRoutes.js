
import { getChatContactsList, getMessages, UnsendMessages, uploadFile } from '../controllers/messageController.js';
import { isAuth } from '../middlewares/isAuth.js';
import express, { Router } from 'express';
import { uploadSingleFile } from '../middlewares/multer.js';

const messageRoutes = express.Router();
messageRoutes.get('/get-chat-contacts',isAuth,getChatContactsList)
messageRoutes.post('/get-messages', isAuth, getMessages);
messageRoutes.post(
  '/upload-file',
  isAuth,
  uploadSingleFile,
  uploadFile
);
messageRoutes.delete('/unsend-messages/:messageId',isAuth,UnsendMessages);
// messageRoutes.get('/chat', isAuth, getChatMessages);
// messageRoutes.get('/:id', isAuth, getAllMessages);
export default messageRoutes;
