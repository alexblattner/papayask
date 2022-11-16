const University = require('../models/university');

exports.create = async (university) => {
    console.log('university', university);
    const newUniversity = await University.create(university);
    return newUniversity;
}