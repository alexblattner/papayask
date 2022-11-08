const mongoose = require('mongoose'),
  { Schema } = mongoose,
  institutionSchema = new Schema(
    {
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
        logo: { type: Schema.Types.ObjectId, ref: 'File' },
        type: { type: Schema.Types.String },
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
module.exports = mongoose.model('Institution', institutionSchema);