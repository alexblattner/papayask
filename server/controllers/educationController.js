const Education = require('../models/education');
const universityController = require('../controllers/universityController');

exports.create = async (education, userId) => {
  const { school, fieldOfStudy } = education;
  if (!school.id) {
    const university = await universityController.create(school);
    school = university._id;
  } else {
    school = school.id;
  }
  const newEducation = await Education.create({
    university: school,
    name: fieldOfStudy,
    user: userId,
    ...education,
  });
  return newEducation;
};
