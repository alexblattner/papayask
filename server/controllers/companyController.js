const Company = require('../models/company');

exports.create = async (company) => {
  try {
    const newCompany = await Company.create(company);
    return newCompany;
  } catch (e) {
    console.log(e);
  }
};

exports.getByName = async (name) => {
  const company = await Company.findOne({ name });
  return company;
};
