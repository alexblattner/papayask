const mongoose = require('mongoose'),
  { Schema } = mongoose,
  fileSchema = new Schema(
    {
      originalname: { type: Schema.Types.String},
      name: { type: Schema.Types.String },
      type: { type: Schema.Types.String },
      owner: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model('File', fileSchema);