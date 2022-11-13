const mongoose = require('mongoose'),
  { Schema } = mongoose,
  educationSchema = new Schema(
    {   
        name: { type: Schema.Types.String, required: true },
        level: { type: Schema.Types.String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        university: { type: Schema.Types.ObjectId, ref: 'University' },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('Education', educationSchema);