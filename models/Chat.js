'use strict';
module.exports = mongoose => {
  const newSchema = new mongoose.Schema({
    fromUserId: {
      type: Number,
      required: [true, "From User is required"]
    },
    toUserId: {
      type: Number,
      required: [true, "To User is required"]
    },
    message: {
      type: [Object],
      required: [true, "Message is required"]
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
  const Chat = mongoose.model('Chat', newSchema);
  return Chat;
};