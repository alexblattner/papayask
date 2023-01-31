const Experiernce = require('../models/experience');
const companyContriller = require('./companyController');

exports.create = async (experience, userId) => {
  const { company } = experience;
  let companyId;

  const existedCompany = await companyContriller.getByName(company.name);

  if (!existedCompany) {
    const newCompany = await companyContriller.create(company);
    companyId = newCompany._id;
  } else {
    companyId = existedCompany._id;
  }
  const body = {
    user: userId,
    ...experience,
    company: companyId,
    endDate: experience.endDate,
  };
  try {
    const newExperience = await Experiernce.create(body);
    return newExperience;
  } catch (e) {
    console.log(e);
  }
};
exports.search = async (searchText) => {
  try {
    const searchResults = await Experiernce.aggregate([
      {
          $match: { name: {$regex: searchText }}
      },
      {
          $group: {
              _id: "$name",
              count: { $sum: 1 }
          }
      }
  ]);
    return searchResults;
  } catch (e) {
    return [];
  }
};