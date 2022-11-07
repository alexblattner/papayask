const mongoose = require('mongoose'),
  { Schema } = mongoose,
  userSchema = new Schema(
    {
      bio: { type: String, default: '' },
      social: [{ type: String }],
      skills: [
        { name: String, relatedAducation: String, relatedExperience: String },
      ],
      experience: [
        {
          position: { type: String, required: true },
          company: { type: String, required: true },
          years: { type: String, required: true },
        },
      ],
      education: [
        {
          school: { type: String, required: true },
          fieldOfStudy: { type: String, required: true },
          years: { type: String, required: true },
        },
      ],
      name: { type: String, required: false },
      email: { type: String, required: true, select: false },
      title: { type: String, required: false },
      picture: { type: String, required: false },
      coverPicture: { type: String, required: false },
      description: { type: String, required: false },
      request_settings: { type: Schema.Types.Mixed, required: false },
      reputation: { type: Number, required: true, default: 0 },
      tokens: { type: [String], select: false },
      confirmed: { type: Boolean, required: true, default: false },
      balance: { type: Number, default: 0, select: false },
      lastLogIn: { type: Schema.Types.Date, required: false, select: false },
      requestCount: { type: Number, default: 0 },
      appleId: { type: String },
      uid: { type: String, required: true },
      isSetUp: {
        type: Boolean,
        default: false,
      },
      authTime: { type: String, required: false, select: false },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('User', userSchema);
