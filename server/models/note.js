const mongoose = require('mongoose'),
  { Schema } = mongoose,
  noteSchema = new Schema({
    content: Array,
    user:{ type: Schema.Types.ObjectId, ref: "User"},
    coordinates: Array,
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  }, {
    timestamps: true
  });
module.exports = mongoose.model("Note", noteSchema);
