const mongoose = require('mongoose'),
  { Schema } = mongoose,
  universitySchema = new Schema(
    {   
        name: { type: Schema.Types.String},
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        country: { type: Schema.Types.String},
        rank: { type: Schema.Types.Number }
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('University', universitySchema);