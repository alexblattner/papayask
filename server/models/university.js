const mongoose = require('mongoose'),
  { Schema } = mongoose,
  universitySchema = new Schema(
    {
      name: { type: Schema.Types.String },
      country: { type: Schema.Types.String },
      logo: { type: Schema.Types.String },
      rank: { type: Schema.Types.Number, default: 1800 },
      logo: { type: Schema.Types.String },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('University', universitySchema);
