import { User } from '../models/userModel.js';
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
