import express from 'express';
import  Message  from '../models/messageModal.js';
import mongoose from 'mongoose';
import { mkdirSync, renameSync, rmdirSync, unlinkSync } from 'fs';
import path from 'path';
import getDataUrl from '../utils/urlGenerator.js';
import cloudinary from 'cloudinary';

export const getChatContactsList = async (req, res, next) => {
  try {
    // Extract the userId from the request and convert it to a MongoDB ObjectId
    let  userId  = req.user._id;
    console.log(userId)
    userId = new mongoose.Types.ObjectId(userId);

    // Aggregate function to fetch chat contacts for the user
    const contacts = await Message.aggregate([
      {
        // Match messages where the user is either the sender or the recipient
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        // Sort the messages by timestamp in descending order (most recent first)
        $sort: { timestamp: -1 },
      },
      {
        // Group messages by the contact person (the other party in the conversation)
        $group: {
          _id: {
            $cond: {
              // If the user is the sender, group by recipient; otherwise, group by sender
              if: { $eq: ['$sender', userId] },
              then: '$recipient',
              else: '$sender',
            },
          },
          // Store the timestamp of the most recent message in each group
          lastMessageTime: { $first: '$timestamp' },
          lastMessage: { $first: '$content' },
          messageType: { $first: '$messageType' },
        },
      },
      {
        // Perform a lookup to join the `users` collection and get contact details
        $lookup: {
          from: 'users',
          localField: '_id', // The contact's ID from the group stage
          foreignField: '_id', // The user's ID in the `users` collection
          as: 'contactInfo', // Store the result in `contactInfo`
        },
      },
      {
        // Unwind the `contactInfo` array to convert it into individual objects
        $unwind: '$contactInfo',
      },
      {
        // Select and project specific fields to include in the final output
        $project: {
          _id: 1, // Contact's ID
          lastMessageTime: 1, // Timestamp of the last message
          email: '$contactInfo.email', // Contact's email
          name: '$contactInfo.name', // Contact's full name
          profilePic: '$contactInfo.profilePic', // Contact's profile image
          lastMessage: '$lastMessage',
          messageType: '$messageType',
        },
      },
      {
        // Sort the final list of contacts by last message time in descending order
        $sort: { lastMessageTime: -1 },
      },
    ]);

    // Send the contacts as a JSON response with a status of 200 (OK)
    console.log(contacts)
    return res.status(200).json({ contacts });
  } catch (err) {
    // If an error occurs, log the error message and return a 500 status (Internal Server Error)
    console.log(err.message);
    return res.status(500).send('Internal Server Error!');
  }
};


export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.user._id;
    console.log(user1)

    const user2 = req.body.id;
    if (!user1 || !user2) {
      return res.status(400).json({ msg: "Both User ID's are requqired" });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal Server Error!');
  }
};

// export const uploadFile = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded');
//     }
//     const date = Date.now();
//     let fileDir = `uploads/files/${date}`;
//     let fileName = `${fileDir}/${req.file.originalname}`;
//     mkdirSync(fileDir, { recursive: true });
//     renameSync(req.file.path, fileName);
//     return res.status(200).json({ filePath: fileName, size: req.file.size });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send('Internal Server Error!');
//   }}


export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    // Determine resource_type based on MIME type
    const mime = req.file.mimetype;
    let resource_type = 'auto'; // Default for images

    if (mime.startsWith('video/')) {
      resource_type = 'video';
    } else if (mime === 'application/pdf' || mime.includes('document') || mime.includes('msword')) {
      resource_type = 'raw'; // Critical for PDFs/DOCs
    }

    const base64Data = `data:${mime};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.v2.uploader.upload(base64Data, {
      folder: 'Trendloop/files',
      resource_type,
      use_filename: true,
      filename_override: req.file.originalname, 
  unique_filename: true,
    });

    return res.status(200).json({
      filePath: result.secure_url,
      id: result.public_id,
      size: req.file.size,
      type: resource_type, // Return type for later reference
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).send('Upload failed: ' + err.message);
  }
};
export const UnsendMessages = async (req, res, next) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ msg: 'Unauthorized to unsend this message' });
    }

    if (message.fileUrl && message.fileUrl.public_id) {
      try {
        await cloudinary.v2.uploader.destroy(message.fileUrl.public_id, {
          resource_type: message.messageType === 'file' ? 'raw' : 'image',
          invalidate: true
        });
      } catch (cloudinaryErr) {
        console.error('Cloudinary deletion error:', cloudinaryErr);
        // Continue with message deletion even if Cloudinary fails
      }
    }

    // 4. Delete from database
    await Message.deleteOne({ _id: messageId });

    return res.status(200).json({ msg: 'Message unsent successfully' });
  } catch (err) {
    console.error('Unsend error:', err);
    return res.status(500).json({ msg: 'Internal Server Error', error: err.message });
  }
};