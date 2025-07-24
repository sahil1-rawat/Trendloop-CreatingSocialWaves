import { User } from '../models/userModel.js';
import getDataUrl from '../utils/urlGenerator.js';
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';

// myProfile Page
export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//userProfile Page

export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user)
      return res.status(404).json({
        message: 'No User found',
      });
    res.json(user);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Follow and Unfollow Users
export const followandUnfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({
        message: 'No User found',
      });
    if (user._id.toString() === loggedInUser._id.toString())
      return res.status(400).json({
        message: "You can't follow yourself",
      });
    if (user.followers.includes(loggedInUser._id)) {
      const indexFollowing = loggedInUser.followings.indexOf(user._id);
      const indexFollower = user.followers.indexOf(loggedInUser._id);
      loggedInUser.followings.splice(indexFollowing, 1);
      user.followers.splice(indexFollower, 1);
      await loggedInUser.save();
      await user.save();
      res.json({
        message: 'User Unfollowed',
      });
    } else {
      loggedInUser.followings.push(user._id);
      user.followers.push(loggedInUser._id);
      await loggedInUser.save();
      await user.save();
      res.json({
        message: 'User Followed',
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Get the Follower and Following Users Data
export const userFollowerandFollowingData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', '-password')
      .populate('followings', '-password');
    res.json({
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name } = req.body;
    if (name) {
      user.name = name;
    }
    const file = req.file;

    if (file) {
      const fileUrl = getDataUrl(file);
      await cloudinary.v2.uploader.destroy(user.profilePic.id);
      const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);
      user.profilePic.id = myCloud.public_id;
      user.profilePic.url = myCloud.secure_url;
    }
    await user.save();
    res.json({
      message: 'Profile Updated',
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// updatePassword
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      return res.status(400).json({
        message: 'All Fields are required',
      });
    }
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        message: 'Wrong old Password',
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'New password and confirm password must match.',
      });
    }

    if (newPassword === oldPassword) {
      return res.status(400).json({
        message: 'New password cannot be the same as the old password.',
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({
      message: 'Password Updated',
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// to get all users
export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {
      $and: [
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        },
        { _id: { $ne: req.user._id } },
        { isAdmin: { $ne: true } }, // 🔒 Exclude admins
      ],
    };

    const users = await User.find(filter)
      .select('-password')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);

    res.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
