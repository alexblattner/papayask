const Education = require('../models/education');
const universityController = require('../controllers/universityController');

exports.create = async (education, userId) => {
  const { university } = education;

  let uniId;

  if (university._id) {
    uniId = university._id;
  } else {
    const newUniversity = await universityController.create(university);
    uniId = newUniversity._id;
  }
  const body = {
    ...education,
    university: uniId,
    user: userId,
    endDate: education.endDate,
  };
  try {
    const newEducation = await Education.create(body);
    return newEducation;
  } catch (e) {
    console.log(e);
  }
};

exports.update = async (education, userId) => {
  const { university } = education;

  let uniId;

  if (university._id) {
    uniId = university._id;
  } else {
    const newUniversity = await universityController.create(university);
    uniId = newUniversity._id;
  }
  const body = {
    ...education,
    university: uniId,
    user: userId,
    endDate: education.endDate,
  };
  try {
    const newEducation = await Education.findByIdAndUpdate(
      education._id,
      body,
      { new: true }
    );
    return newEducation;
  } catch (e) {
    console.log(e);
  }
};
