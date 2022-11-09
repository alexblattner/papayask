const mongoose = require('mongoose'),
  { Schema } = mongoose,
  experienceSchema = new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      position: { type: Schema.Types.String },
      company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
      },
      geographic_specialization: [{ type: Schema.Types.String }],
      type: { type: Schema.Types.String },
      startDate: { type: Schema.Types.Date, required: true },
      endDate: { type: Schema.Types.Date },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('Experience', experienceSchema);
