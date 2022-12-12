const University = require('../models/university');

exports.create = async (university) => {
    const newUniversity = await University.create(university);
    return newUniversity;
}