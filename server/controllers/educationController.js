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
    university: uniId,
    user: userId,
    ...education,
    endDate: education.endDate,
  };
  try {
    const newEducation = await Education.create(body);
    return newEducation;
  } catch (e) {
    console.log(e);
  }
};
exports.search = async (searchText) => {
  try {
    const searchResults = await Education.aggregate([
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
    console.log(searchText,searchResults);
    return searchResults;
  } catch (e) {
    return [];
  }
};