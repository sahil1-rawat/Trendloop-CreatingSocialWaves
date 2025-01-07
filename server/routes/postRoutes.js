import express, { Router } from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import {
  commentOnPost,
  deleteComment,
  deletePost,
  editCaption,
  getAllPosts,
  likeUnlikePost,
  newPost,
} from '../controllers/postController.js';
import uploadFile from '../middlewares/multer.js';
const postRoutes = Router();
postRoutes.post('/new', isAuth, uploadFile, newPost);
postRoutes.get('/all', isAuth, getAllPosts);
postRoutes.delete('/delete/:id', isAuth, deletePost);
postRoutes.put('/edit/:id', isAuth, editCaption);
postRoutes.post('/comment/:id', isAuth, commentOnPost);
postRoutes.post('/likeunlike/:id', isAuth, likeUnlikePost);
postRoutes.delete('/comment/:id', isAuth, deleteComment);
export default postRoutes;
