import express, { Router } from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import {
  commentOnPost,
  deleteComment,
  deletePost,
  editCaption,
  editComment,
  getAllPosts,
  likeUnlikePost,
  newPost,
  postLikesData,
  replyComment,
  sharePost,
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
postRoutes.put('/comment/:id', isAuth, editComment);
postRoutes.post('/likes/:id', isAuth, postLikesData);
postRoutes.post('/share/:id', isAuth, sharePost);
postRoutes.post('/reply/:id', isAuth, replyComment);
export default postRoutes;
