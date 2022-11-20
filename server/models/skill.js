const mongoose = require('mongoose'),
  { Schema } = mongoose,
  skillSchema = new Schema(
    {   
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: Schema.Types.String, required: true },
        experiences: [{
          years:{ type: Schema.Types.Number },
          experience:{ type: Schema.Types.ObjectId, ref: 'Experience', required: true }
        }],
        educations: [{
          years:{ type: Schema.Types.Number },
          education:{ type: Schema.Types.ObjectId, ref: 'Education', required: true }
        }],
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('Skill', skillSchema);