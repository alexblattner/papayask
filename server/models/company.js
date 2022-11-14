const mongoose = require('mongoose');
const { Schema } = mongoose;
companySchema = new Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
