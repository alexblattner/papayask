const mongoose = require('mongoose'),
  { Schema } = mongoose,
  noteSchema = new Schema({
    content: { type: String, required: true },
    user:{ type: Schema.Types.ObjectId, ref: "User"},
    coordinates: { type: Schema.Types.Mixed },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  }, {
    timestamps: true
  });
module.exports = mongoose.model("Note", noteSchema);
