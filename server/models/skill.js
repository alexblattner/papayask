const mongoose = require('mongoose'),
  { Schema } = mongoose,
  skillSchema = new Schema(
    {   
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: Schema.Types.String},
        experiences: [{
          time:{ type: Schema.Types.Number },
          experience:{ type: Schema.Types.ObjectId, ref: 'Institution', required: true }
        }],
        total: { type: Schema.Types.Number }
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('Skill', skillSchema);