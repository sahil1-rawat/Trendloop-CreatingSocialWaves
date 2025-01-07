import { User } from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import getDataUrl from '../utils/urlGenerator.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';

// Registration Page
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;
    const file = req.file;
    if (!name || !email || !password || !gender || !file) {
      return res.status(400).json({
        message: 'Please give all values',
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: 'User Already Exist',
      });
    }
    const fileUrl = getDataUrl(file);
    const hashPassword = await bcrypt.hash(password, 10);
    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);

    user = await User.create({
      name,
      email,
      password: hashPassword,
      gender,
      profilePic: {
        id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    generateToken(user._id, res);
    res.status(201).json({
      message: 'User Registered Success',
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// Login Page
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: 'Give all values',
      });
    }
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: 'Invalid Credentials email',
      });
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return res.status(400).json({
        message: 'Invalid Credentials pass',
      });
    generateToken(user._id, res);
    res.status(201).json({
      message: 'User Logged in',
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 0 });
    res.json({
      message: 'Logged Out Successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
