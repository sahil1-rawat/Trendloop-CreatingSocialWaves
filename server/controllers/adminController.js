import mongoose from 'mongoose';
import { User } from '../models/userModel.js';
import { Post } from '../models/postModel.js';

export const getAdminStats = async (req, res) => {
  try {
    // Total users (non-admin)
    const totalUsers = await User.countDocuments({ isAdmin: false });

    const totalPosts = await Post.countDocuments();

    // New users in last 7 days (non-admin)
    const lastWeek = new Date();
    const lastMonth = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const newSignups = await User.countDocuments({
      isAdmin: false,
      createdAt: { $gte: lastWeek }
    });

   const twelveMonthsAgo = new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 11, 1); 

const monthlyUserGrowth = await User.aggregate([
  {
    $match: {
      isAdmin: false,
      createdAt: { $gte: twelveMonthsAgo }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      },
      count: { $sum: 1 }
    }
  },
  {
    $sort: {
      '_id.year': 1,
      '_id.month': 1
    }
  }
]);
     const userGrowth = await User.aggregate([
      {
        $match: {
          isAdmin: false,
          createdAt: { $gte: lastWeek }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    // Recent 7 non-admin users
    const recentUsers = await User.find({ isAdmin: false })
      .sort({ createdAt: -1 })
      .limit(7)
      .select('_id name email');
//console.log(monthlyUserGrowth);
    res.status(200).json({
      stats: {
        totalUsers,
        totalPosts,
        newSignups,
        userGrowth,
        monthlyUserGrowth
      },
      recentUsers
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





// @desc    Get all users (excluding password)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const banOrUnbanUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = !user.isBanned;

    await user.save(); // ✅ Save updated field properly

    res.status(200).json({ message: `User has been ${user.isBanned ? 'banned' : 'unbanned'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user status' });
  }
};








export const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('owner', 'name email profilePic')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Delete a post by ID
export const deletePostAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};
