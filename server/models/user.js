const mongoose = require('mongoose'),
  { Schema } = mongoose,
  userSchema = new Schema(
    {
      username: { type: String, required: false },
      email: { type: String, required: true, select: false },
      password: { type: String, select: false, required: true },
      picture: { type: String, required: false },
      description: { type: String, required: false },
      links: {
        type: [{ type: String }],
        required: false,
      },
      expertise: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
        required: false,
      },
      request_settings: { type: Schema.Types.Mixed, required: false },
      reviews: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
        default: [],
      },
      comments: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        default: [],
      },
      posts: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
        default: [],
      },
      votes: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
        default: [],
      },
      reputation: { type: Number, required: true, default: 0 },
      tokens: { type: [String], select: false },
      confirmed: { type: Boolean, required: true, default: false },
      balance: { type: Number, default: 0, select: false },
      lastLogIn: { type: Schema.Types.Date, required: false, select: false },
      requestCount: { type: Number, default: 0 },
      appleId: { type: String },
      isSetUp: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('User', userSchema);
