const mongoose = require('mongoose'),
  { Schema } = mongoose,
  notificationSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: false },
    question: {type : Schema.Types.ObjectId, ref: 'Question'},
  }, {
    timestamps: true
  });
module.exports = mongoose.model("Notification", notificationSchema);
