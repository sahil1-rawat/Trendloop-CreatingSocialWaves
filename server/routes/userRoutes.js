import express, { Router } from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { uploadSingleFile } from '../middlewares/multer.js';
import {
  followandUnfollowUser,
  getAllUsers,
  myProfile,
  updatePassword,
  updateProfile,
  userFollowerandFollowingData,
  userProfile,
} from '../controllers/userController.js';
import { User } from '../models/userModel.js';

const userRoutes = Router();
userRoutes.get('/me', isAuth, myProfile);
userRoutes.get('/:id', isAuth, userProfile);
userRoutes.put('/:id', isAuth, uploadSingleFile, updateProfile);
userRoutes.post('/:id', isAuth, updatePassword);
userRoutes.get('/get/alluser', isAuth, getAllUsers);
userRoutes.post('/follow/:id', isAuth, followandUnfollowUser);
userRoutes.get('/followData/:id', isAuth, userFollowerandFollowingData);

export default userRoutes;
