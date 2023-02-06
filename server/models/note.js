const mongoose = require('mongoose'),
  { Schema } = mongoose,
  noteSchema = new Schema({
    content: { type: String, required: true },
    user:{ type: Schema.Types.ObjectId, ref: "User"},
    coordinates: { type: Schema.Types.Mixed },
    replyTo: { type: Schema.Types.ObjectId, ref: "Note" },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    type: { type: String, enum: ['clarification', 'refusal', 'answer','acceptance'], default: 'answer' },
  }, {
    timestamps: true
  });
module.exports = mongoose.model("Note", noteSchema);
