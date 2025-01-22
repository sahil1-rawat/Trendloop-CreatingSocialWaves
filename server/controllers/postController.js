import { Post } from '../models/postModel.js';
import getDataUrl from '../utils/urlGenerator.js';
import cloudinary from 'cloudinary';

// Post
export const newPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const ownerId = req.user._id;

    const files = req.files;
    const fileUrls = files.map((file) => getDataUrl(file));

    let options = [];
    const type = req.query.type;

    if (type === 'reel') {
      options = files.map(() => ({ resource_type: 'video' }));
    } else {
      options = files.map(() => ({}));
    }

    // Upload all files to Cloudinary
    const uploadedFiles = await Promise.all(
      files.map((file, index) =>
        cloudinary.v2.uploader.upload(fileUrls[index].content, options[index])
      )
    );

    const post = await Post.create({
      caption,
      post: uploadedFiles.map((file) => ({
        id: file.public_id,
        url: file.secure_url,
      })),
      owner: ownerId,
      type,
    });

    res.status(201).json({
      message: 'Post Created',
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: 'Post Not Found',
      });
    }
    if (req.user._id.toString() !== post.owner.toString()) {
      return res.status(403).json({
        message: 'Unauthorized User',
      });
    }
    for (let file of post.post) {
      await cloudinary.v2.uploader.destroy(file.id);
    }
    await post.deleteOne();
    return res.status(200).json({
      message: 'Post Deleted',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Edit caption
export const editCaption = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { newCaption } = req.body;
    if (!post) {
      return res.status(404).json({
        message: 'Post Not Found',
      });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Unauthorized User',
      });
    }
    post.caption = newCaption;
    await post.save();

    return res.status(200).json({
      message: 'Caption Edited',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//Get All post of the user

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ type: 'post' })
      .sort({ createdAt: -1 })
      .select('-password')
      .populate('owner', '-password')
      .populate({ path: 'comments.user', select: '-password' });
    const reels = await Post.find({ type: 'reel' })
      .sort({ createdAt: -1 })
      .select('-password')
      .populate('owner', '-password')
      .populate({ path: 'comments.user', select: '-password' });
    res.json({ posts, reels });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Comment on Post

export const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const isOnlySpaces = (str) => str.trim().length === 0;
    const { comment } = req.body;
    if (!post) {
      return res.status(404).json({
        message: 'Post Not Found',
      });
    }
    if (!comment || isOnlySpaces(comment)) {
      return res.status(400).json({
        message: "can't send empty comment",
      });
    }

    post.comments.push({
      user: req.user._id,
      profilePic: req.user.profilePic.url,
      name: req.user.name,
      comment,
    });
    await post.save();
    return res.status(201).json({
      message: 'Comment Added Successfully',
      totalComments: post.comments.length,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Comment

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }
    if (req.query.commentId) {
      return res.status(400).json({
        message: 'Please provide a comment id',
      });
    }

    const commentIndex = post.comments.findIndex(
      (item) => item._id.toString() === req.body.commentId.toString()
    );
    if (commentIndex === -1) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }
    const comment = post.comments[commentIndex];

    if (
      post.owner.toString() === req.user._id.toString() ||
      comment.user.toString() === req.user._id.toString()
    ) {
      post.comments.splice(commentIndex, 1);
      await post.save();
      return res.json({
        message: 'Comment deleted',
      });
    } else {
      return res.status(403).json({
        message: 'You are not authorized to delete this comment',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// like unlike post
export const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }
    const { _id } = req.user;
    const isLiked = post.likes.includes(_id);
    if (isLiked) {
      post.likes.pull(_id);
    } else {
      post.likes.push(_id);
    }
    await post.save();
    res.status(200).json({
      message: isLiked ? 'Post Unliked' : 'Post liked',
      totalLikes: post.likes.length,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Edit a comment
export const editComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }
    const { commentId, newComment } = req.body;
    if (!commentId || !newComment) {
      return res.status(400).json({
        message: 'Please provide commentId and newComment',
      });
    }
    const commentIndex = post.comments.findIndex(
      (item) => item._id.toString() === commentId.toString()
    );
    if (commentIndex === -1) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }
    const comment = post.comments[commentIndex];
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to edit this comment',
      });
    }
    post.comments[commentIndex].comment = newComment;
    await post.save();
    res.json({
      message: 'Comment edited',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
