const mongoose = require('mongoose'),
  { Schema } = mongoose,
  educationSchema = new Schema(
    {
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
        logo: { type: Schema.Types.ObjectId, ref: 'File' },
        website: { type: Schema.Types.String },
        email: { type: Schema.Types.String },
        country: { type: Schema.Types.String },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        reputation: { type: Schema.Types.Number, default: 0 },
        foundingDate: { type: Schema.Types.Date },
        closedDate: { type: Schema.Types.Date },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('Education', educationSchema);