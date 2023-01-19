const mongoose = require('mongoose'),
  { Schema } = mongoose,
  userSchema = new Schema(
    {
      bio: { type: String, default: '' },
      social: [{ type: String }],
      experience: [{ type: Schema.Types.ObjectId, ref: 'Experience' }],
      education: [{ type: Schema.Types.ObjectId, ref: 'Education' }],
      name: { type: String, required: false },
      skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
      email: { type: String, required: true, select: false },
      title: { type: String, required: false },
      picture: { type: String },
      coverPicture: { type: Schema.Types.ObjectId, ref: 'File' },
      description: { type: String, required: false },
      request_settings: { type: Schema.Types.Mixed, required: false },
      reputation: { type: Number, required: true, default: 0 },
      tokens: { type: [String], select: false },
      confirmed: { type: Boolean, required: true, default: false },
      balance: { type: Number, default: 0, select: false },
      lastLogIn: { type: Schema.Types.Date, required: false, select: false },
      requestCount: { type: Number, default: 0 },
      appleId: { type: String },
      verified: { type: Boolean, default: false },
      uid: { type: String, required: true },
      languages: [{ type: String }],
      country: { type: String },
      advisorStatus: {
        type: mongoose.Schema.Types.Mixed,
        enum: ['pending', 'approved', false],
        default : false,
      },
      isSetUp: {
        type: Boolean,
        default: false,
      },
      questionsInstructions: { type: String },
      favorites: {
        users: [
          {
            name: { type: String },
            id: { type: Schema.Types.ObjectId, ref: 'User' },
            title: { type: String },
            picture: { type: String },
          },
        ],
        questions: [
          {
            id: { type: Schema.Types.ObjectId, ref: 'Question' },
            description: { type: String },
            senderName: { type: String },
            senderPicture: { type: String },
            createdAt: { type: Schema.Types.Date },
            status: {
              action: {
                type: String,
                enum: ['pending', 'accepted', 'rejected'],
                default: 'pending',
              },
              reason: { type: String },
              done: { type: Boolean, default: false },
            },
            endAnswerTime: { type: Date, required: true },
          },
        ],
      },
      authTime: { type: String, required: false, select: false },
    },
    {
      timestamps: true,
    }
  );

userSchema.pre('findOne', function (next) {
  populateUser.call(this);
  next();
});

userSchema.pre('save', async function (next) {
  await populateUser.call(this);
  next();
});

userSchema.pre('find', function (next) {
  populateUser.call(this);
  next();
});

userSchema.pre('findById', function (next) {
  populateUser.call(this);
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  populateUser.call(this);
  next();
});

function populateUser() {
  this.populate({
    path: 'experience',
    populate: { path: 'company', model: 'Company' },
  });
  this.populate({
    path: 'education',
    populate: { path: 'university', model: 'University' },
  });
  this.populate({
    path: 'skills',
    populate: [
      {
        path: 'experiences.experience',
        model: 'Experience',
        populate: {
          path: 'company',
          model: 'Company',
        },
      },
      {
        path: 'educations.education',
        model: 'Education',
        populate: {
          path: 'university',
          model: 'University',
        },
      },
    ],
  });
}

module.exports = mongoose.model('User', userSchema);
