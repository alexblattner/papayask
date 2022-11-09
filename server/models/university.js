const mongoose = require('mongoose'),
  { Schema } = mongoose,
  universitySchema = new Schema(
    {   
        name: { type: Schema.Types.String},
        country: { type: Schema.Types.String},
        rank: { type: Schema.Types.Number }
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('University', universitySchema);