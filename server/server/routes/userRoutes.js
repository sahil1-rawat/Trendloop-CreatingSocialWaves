import express, { Router } from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { myProfile, userProfile } from '../controllers/userController.js';

const userRoutes = Router();
userRoutes.get('/me', isAuth, myProfile);
userRoutes.get('/:id', isAuth, userProfile);
export default userRoutes;
