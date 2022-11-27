const mongoose = require("mongoose"),
  { Schema } = mongoose,
  questionSchema = new Schema(
    {
      sender: { type: Schema.Types.ObjectId, ref: "User"},
      receiver: { type: Schema.Types.ObjectId, ref: "User"},
      description: { type: Schema.Types.Mixed, required: true },
      files: [{ type: Schema.Types.ObjectId, ref: "File" }],
      notes: {
        type: [{ type: Schema.Types.ObjectId, ref: "Note" }],
        default: [],
      },
      status: {
        action: { type: String, default: "pending" },
        reason: { type: String, default: "" },
        done: { type: Boolean, default: false },
      },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model("Question", questionSchema);
