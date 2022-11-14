const Experiernce = require('../models/experience');
const companyContriller = require('./companyController');

exports.create = async (experience, userId) => {
  const { company } = experience;

  const existedCompany = await companyContriller.getByName(company);

  if (!existedCompany) {
    const newCompany = await companyContriller.create({ name: company });
    experience.company = newCompany._id;
  } else {
    experience.company = existedCompany._id;
  }

  const newExperience = await Experiernce.create({
    user: userId,
    name: experience.position,
    ...experience,
  });
  return newExperience;
};
