import express, { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/authController.js';
import { uploadSingleFile } from '../middlewares/multer.js';

const AuthRoutes = Router();
AuthRoutes.post('/register', uploadSingleFile, registerUser);
AuthRoutes.post('/login', loginUser);
AuthRoutes.get('/logout', logoutUser);
export default AuthRoutes;
