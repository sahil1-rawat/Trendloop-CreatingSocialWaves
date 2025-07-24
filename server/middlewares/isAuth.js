import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).json({
        message: 'Unauthorized Token',
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedData) {
      return res.status(400).json({
        message: 'Token Expired',
      });
    }

    const user = await User.findById(decodedData.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 🔐 Check if the user is banned
    if (user.isBanned) {
      return res.status(403).json({ message: 'User is banned' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      message: 'Please Login',
    });
  }
};
