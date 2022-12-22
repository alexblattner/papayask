const Company = require("../models/company");
const LinkedIn = require('node-linkedin')(process.env.LINKEDIN_CLIENT_ID, process.env.LINKEDIN_SECRET, 'oob');

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

exports.search = async (req, res, next) => {
  const token=await LinkedIn.auth.getAccessToken();  
  console.log(22222,token)
}