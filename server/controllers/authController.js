import { User } from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import getDataUrl from '../utils/urlGenerator.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';

// Registration Page
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender,isAdmin=false } = req.body;
    const file = req.file;
    if (!name || !email || !password || !gender) {
      return res.status(400).json({
        message: 'Please give all values',
      });
    }
    if (!file) {
      return res.status(400).json({
        message: 'Profile Picture is required',
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
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
      isAdmin,
      profilePic: {
        id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    const token = generateToken(user._id, res);
    res.status(201).json({
      message: 'User Registered Success',
      user,
      token,
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
//console.log(user)
    if (!user)
      return res.status(404).json({
        message: 'Invalid Credentials',
      });
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return res.status(404).json({
        message: 'Invalid Credentials',
      });
    if (user.isBanned) {
      return res.status(403).json({
        message: 'You are banned from this platform',
      });
  }
    const token = generateToken(user._id, res);
    // //console.log('token' + generateToken(user._id, res));
    return res.status(201).json({
      message: 'User Logged in',
      user,
      token,
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
    res.status(200).json({
      message: 'Logged Out Successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
