const University = require("../models/university");

exports.create = async (university) => {
  const newUniversity = await University.create(university);
  return newUniversity;
};

exports.search = async (searchText) => {
  try {
    const searchResults = await University.find({
      $match: { name: searchText },
    });
    return searchResults;
  } catch (e) {
    return [];
  }
};
