import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  messageType: {
    type: String,
    enum: ['text', 'file'],
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === 'text';
    },
  },
  fileUrl: {
  id: {
    type: String,
    required: function () {
      return this.messageType === 'file';
    },
  },
  url: {
    type: String,
    required: function () {
      return this.messageType === 'file';
    },
  },
},

  timestamp: {
    type: Date,
    default: Date.now,
  },
  deletedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
