const Company = require('../models/company');
const LinkedIn = require('node-linkedin')(
  process.env.LINKEDIN_CLIENT_ID,
  process.env.LINKEDIN_SECRET,
  'oob'
);

exports.create = async (company) => {
  try {
    const newCompany = await Company.create(company);
    return newCompany;
  } catch (e) {
    console.log(e);
  }
};

exports.update = async (req, res) => {
  const company = req.body;
  const updatedCompany = await Company.findOneAndUpdate(
    { _id: company._id },
    company,
    { new: true }
  );
  console.log(updatedCompany);
  return res.status(200).json({ company: updatedCompany });
};

exports.getByName = async (name) => {
  const company = await Company.findOne({ name });
  return company;
};

exports.search = async (req, res, next) => {
  const {search}  = req.params;
  const companies = await Company.find({
    name: { $regex: search, $options: 'i' },
  });
  return res.status(200).json({ companies });
};
