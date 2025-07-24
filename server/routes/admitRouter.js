import express from 'express';
import { banOrUnbanUser, deletePostAdmin, getAdminStats, getAllPostsAdmin, getAllUsers } from '../controllers/adminController.js';
import { isAuth } from '../middlewares/isAuth.js';

const AdminRoutes = express.Router();

// GET /api/admin/stats
AdminRoutes.get('/stats', getAdminStats);
AdminRoutes.get('/users', getAllUsers);
// PUT ban or unban
AdminRoutes.patch('/:id/ban', banOrUnbanUser);
AdminRoutes.get('/posts', isAuth, getAllPostsAdmin);

AdminRoutes.delete('/posts/:id', isAuth, deletePostAdmin);

export default AdminRoutes;
