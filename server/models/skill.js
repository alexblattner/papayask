const mongoose = require('mongoose'),
  { Schema } = mongoose,
  experienceSchema = new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: Schema.Types.String },
      experiences: [
        {
          time: { type: Schema.Types.Number },
          experience: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
          },
        },
      ],

      education: [
        {
          time: { type: Schema.Types.Number },
          education: {
            type: Schema.Types.ObjectId,
            ref: 'Education',
            required: true,
          },
        },
      ],
      total: { type: Schema.Types.Number },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('Experience', experienceSchema);
