import express, { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/authController.js';
import uploadFile from '../middlewares/multer.js';

const AuthRoutes = Router();
AuthRoutes.post('/register', uploadFile, registerUser);
AuthRoutes.post('/login', loginUser);
AuthRoutes.get('/logout', logoutUser);
export default AuthRoutes;
