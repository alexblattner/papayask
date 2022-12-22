const mongoose = require('mongoose');
const { Schema } = mongoose;
companySchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String },
    website: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
