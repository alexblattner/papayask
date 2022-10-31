const mongoose = require("mongoose"),
  { Schema } = mongoose,
  sessionSchema = new Schema(
    {
      sessionId: { type: String, required: true },
      userId: { type: Schema.Types.ObjectId, required: true },
    },
    {
      timestamps: true,
    }
  );
module.exports = mongoose.model("Session", sessionSchema);