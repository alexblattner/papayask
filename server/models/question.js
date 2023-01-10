const mongoose = require('mongoose'),
  { Schema } = mongoose,
  questionSchema = new Schema(
    {
      sender: { type: Schema.Types.ObjectId, ref: 'User' },
      receiver: { type: Schema.Types.ObjectId, ref: 'User' },
      description: { type: Schema.Types.Mixed, required: true },
      files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
      endAnswerTime: { type: Date, required: true },
      status: {
        action: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        reason: { type: String },
        done: { type: Boolean, default: false },
      },
      notes: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

questionSchema.pre('findOne', function (next) {
  populateQuestion.call(this);
  next();
});

questionSchema.pre('save', async function (next) {
  await populateQuestion.call(this);
  next();
});

questionSchema.pre('find', function (next) {
  populateQuestion.call(this);
  next();
});

questionSchema.pre('findById', function (next) {
  populateQuestion.call(this);

  next();
});

async function populateQuestion() {
  this.populate({
    path: 'sender',
    model: 'User',
  });
  this.populate({
    path: 'receiver',
    model: 'User',
  });
  this.populate({
    path: 'notes',
    model: 'Note',
    populate: [
      {
        path: 'user',
        model: 'User',
      },
    ]
  });
}
module.exports = mongoose.model('Question', questionSchema);
