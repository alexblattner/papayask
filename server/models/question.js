const mongoose = require("mongoose"),
  { Schema } = mongoose,
  questionSchema = new Schema(
    {
      sender: { type: Schema.Types.ObjectId, ref: "User"},
      receiver: { type: Schema.Types.ObjectId, ref: "User"},
      description: { type: Schema.Types.Mixed, required: true },
      files: [{ type: Schema.Types.ObjectId, ref: "File" }],
      done: { type: Boolean, default: false },
      notes: {
        type: [{ type: Schema.Types.ObjectId, ref: "Note" }],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model("Question", questionSchema);
