const mongoose = require('mongoose');

const { Schema } = mongoose;

const purchaseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cost: { type: Number, required: true },
    transactionId: { type: String, required: true },
    purchased: { type: Schema.Types.Mixed, default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
