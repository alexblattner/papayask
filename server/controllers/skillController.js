const Skill = require('../models/skill');
const Experience = require('../models/experience');
const Education = require('../models/education');

exports.create = async (skill, userId) => {
  const { education, experiences } = skill;
  let experienceList = [];
  for (let i = 0; i < experiences.length; i++) {
    const exp = await Experience.findOne({
      name: experiences[i].experience.name,
      startDate: experiences[i].experience.startDate,
      endDate: experiences[i].experience.endDate,
    }).exec();
    experienceList.push({
      time: experiences[i].years,
      experience: exp._id,
    });
  }
  let educationList = [];
  for (let i = 0; i < education.length; i++) {
    const edu = await Education.findOne({
      name: education[i].education.name,
      startDate: education[i].education.startDate,
      endDate: education[i].education.endDate,
    }).exec();
    educationList.push({
      time: education[i].years,
      education: edu._id,
    });
  }

  const newSkill = await Skill.create({
    user: userId,
    experiences: experienceList,
    education: educationList,
    ...skill,
  });
  return newSkill;
};
