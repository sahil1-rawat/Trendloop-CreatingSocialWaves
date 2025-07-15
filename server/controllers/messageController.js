import express from 'express';
import { Chat } from '../models/chatModel.js';
import { Messages } from '../models/messageModel.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    console.log(receiverId);
    const senderId = req.user._id.toString();
    // Validate inputs
    if (!receiverId) {
      return res.status(400).json({ message: 'Please provide a recipient' });
    }

    if (!message || message.trim() === '') {
      return res
        .status(400)
        .json({ message: 'Message content cannot be empty' });
    }

    // Sort users for consistent ordering
    const sortedUsers = [senderId, receiverId].sort();
    console.log(sortedUsers);

    // Find or create chat
    let chat = await Chat.findOneAndUpdate(
      { users: sortedUsers },
      {
        $setOnInsert: { users: sortedUsers },
        $set: {
          latestMessage: {
            text: message,
            sender: senderId,
          },
        },
      },
      { upsert: true, new: true }
    );

    // Save the message
    const newMessage = new Messages({
      chatId: chat._id,
      sender: senderId,
      text: message,
    });
    await newMessage.save();

    await chat.updateOne({
      latestMessage: {
        text: message,
        sender: senderId,
      },
    });
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all messages
export const getAllMessages = async (req, res) => {
  try {
    const { id } = req.params; // Recipient ID
    console.log(id);
    const userId = req.user._id.toString();

    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }
    const sortedUsers = [userId, id].sort();

    // Find chat
    const chat = await Chat.findOne({ users: sortedUsers });
    if (!chat) {
      return res.status(404).json({ message: 'No chat found' });
    }
    // Default to page 1, 20 messages per page
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch messages with pagination
    const messages = await Messages.find({ chatId: chat._id })
      .sort({ createdAt: -1 }) // Sort messages by newest first
      .skip(skip)
      .limit(parseInt(limit));

    // Return messages
    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalMessages: await Messages.countDocuments({ chatId: chat._id }),
      messages,
    });
  } catch (err) {
    // Handle errors gracefully
    console.error(err); // Log detailed error for debugging
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// to get all chat of user

export const getChatMessages = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(403).json({
        message: 'User not authenticated',
      });
    }

    const { page = 1, limit = 20 } = req.query; // Default to page 1 and 20 chats per page
    const skip = (page - 1) * limit;

    // Fetch the chats for the logged-in user
    const chats = await Chat.find({ users: req.user._id })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'users',
        select: 'name profilePic',
      });
    chats.forEach((e) => {
      e.users = e.users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      );
    });
    if (!chats || chats.length === 0) {
      return res.status(404).json({
        message: 'No chats found for this user',
      });
    }

    const totalChats = await Chat.countDocuments({ users: req.user._id });

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalChats,
      chats,
    });
  } catch (err) {
    console.error(err); // For debugging
    return res.status(500).json({
      message: 'Something went wrong, please try again later.',
    });
  }
};
