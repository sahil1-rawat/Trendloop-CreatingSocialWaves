import { Server as SocketIOServer } from 'socket.io'; // Import Socket.IO server
import Group from '../models/GroupModel.js'; // Import group model for database interactions
import Message from '../models/messageModal.js';

const setupSocket = (server) => {
  // Initialize Socket.IO server with CORS settings
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN, // Allow requests from this origin
      methods: ['GET', 'POST'], // Allow only GET and POST requests
      credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    },
  });

  // Map to keep track of user IDs and their corresponding socket IDs
  const userSocketMap = new Map();
  // Map to keep track of online/offline status
  const userStatusMap = new Map();

  // Function to handle socket disconnection
  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    // Remove the user from the map when they disconnect
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        userStatusMap.set(userId, false); // Set status to offline
        // Notify other users about the status change
        io.emit('userStatusChange', { userId, status: 'offline' });
        break;
      }
    }
  };

  // Function to handle sending messages
  const sendMessage = async (message) => {
    try {
      // Get socket IDs for sender and recipient
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      // Save message to the database
      const createdMessage = await Message.create(message);
      console.log(createdMessage);

      // Retrieve the saved message with populated sender and recipient details
      const messageData = await Message.findById(createdMessage._id)
        .populate('sender', 'id email name gender followers followings profilePic')
        .populate('recipient', 'id email name gender followers followings profilePic');

      // console.log('Message data to send:', messageData);

      // Emit the message to the recipient if they are connected
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receiveMessage', messageData);
      }
      // Emit the message to the sender if they are connected
      if (senderSocketId) {
        io.to(senderSocketId).emit('receiveMessage', messageData); // Use the same event name for sender
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

const unsendMessage = async ({ messageId, userId }, socket) => {
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      socket.emit('unsendError', { messageId, error: 'Message not found' });
      return;
    }

    if (message.sender.toString() !== userId.toString()) {
      socket.emit('unsendError', { messageId, error: 'Unauthorized' });
      return;
    }

    await Message.deleteOne({ _id: messageId });

    const path = message.fileUrl;
    if (path && path.public_id) {
      await cloudinary.v2.uploader.destroy(path.public_id, {
        resource_type: message.messageType === 'file' ? 'raw' : 'image',
        invalidate: true,
      });
    }

    // Notify the sender and recipient
    const senderSocketId = userSocketMap.get(message.sender.toString());
    const recipientSocketId = userSocketMap.get(message.recipient.toString());

    if (senderSocketId) {
      io.to(senderSocketId).emit('messageUnsent', { messageId });
    }

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('messageUnsent', { messageId });
    }

  } catch (error) {
    console.error('Error unsending message:', error);
    socket.emit('unsendError', { messageId, error: 'Internal Server Error' });
  }
};

  const sendGroupMessage = async (message) => {
    try {
      const { groupId, sender, content, messageType, fileUrl } = message;
      const createdMessage = await Message.create({
        sender,
        recipient: null,
        content,
        messageType,
        fileUrl,
        timestamp: new Date(),
      });
      const messageData = await Message.findById(createdMessage._id)
        .populate('sender', 'id email name gender followers followings profilePic')
        .exec();
      await Group.findByIdAndUpdate(groupId, {
        $push: { messages: createdMessage._id },
      });
      const group = await Group.findById(groupId).populate('members');
      const finalData = { ...messageData._doc, groupId: group._id };
      if (group && group.members) {
        group.members.forEach((member) => {
          const memberSocketId = userSocketMap.get(member._id.toString());
          if (memberSocketId) {
            io.to(memberSocketId).emit('receive-group-message', finalData);
          }
        });
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  // Set up Socket.IO event handlers
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // Get user ID from socket handshake query

    if (userId) {
      // Map user ID to socket ID
      userSocketMap.set(userId, socket.id);
      userStatusMap.set(userId, true); // Set status to online
      console.log(`User connected: ${userId} with socket ID ${socket.id}`);

      // Notify other users about the status change
      io.emit('userStatusChange', { userId, status: 'online' });

      // Emit current status of all users to the newly connected user
      socket.emit(
        'multipleUserStatusChange',
        Object.fromEntries(userStatusMap)
      );
    } else {
      console.log('User ID not provided during connection');
    }

    // Listen for 'sendMessage' events and handle them with sendMessage function
    socket.on('sendMessage', sendMessage);
    // Listen for 'unsendMessage' events and handle them with unsendMessage function
socket.on('unsendMessage', (messageId) =>
  unsendMessage({ messageId, userId }, socket)
);
    socket.on('send-group-message', sendGroupMessage);

    // Listen for 'getSocketIds' events and handle them with getSocketIds function

    // Listen for 'disconnect' events and handle them with disconnect function
    socket.on('disconnect', () => disconnect(socket));
  });

  return io; // Return the Socket.IO instance if needed elsewhere
};

export default setupSocket;
