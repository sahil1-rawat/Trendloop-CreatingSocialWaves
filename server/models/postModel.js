import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  caption: String,
  post: [
    {
      id: String,
      url: String,
    },
  ],
  type: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      profilePic: {
        type: String,
      },

      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

export const Post = mongoose.model('Post', postSchema);
