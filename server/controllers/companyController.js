const Company = require('../models/company');

exports.create = async (company) => {
    const newCompany = await Company.create(company);
    return newCompany;
};

exports.getByName = async (name) => {
    const company = await Company.findOne({ name });
    return company;
}