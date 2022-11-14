const Skill = require('../models/skill');
const Experience = require('../models/experience');
const Education = require('../models/education');

exports.create = async (skill, userId) => {
  const { relatedEducation, relatedExperience } = skill;
  let experienceList = [];
  for (let i = 0; i < relatedEducation.length; i++) {
    const experience = await Experience.findOne({
      name: relatedExperience[i].experience.position,
      startDate: relatedExperience[i].experience.startDate,
      endDate: relatedExperience[i].experience.endDate,
    }).exec();
    experienceList.push({
      time: relatedExperience[i].years,
      experience: experience._id,
    });
  }
  let educationList = [];
  for (let i = 0; i < relatedEducation.length; i++) {
    const education = await Education.findOne({
      name: relatedEducation[i].education.fieldOfStudy,
      startDate: relatedEducation[i].education.startDate,
      endDate: relatedEducation[i].education.endDate,
    }).exec();
    educationList.push({
      time: relatedEducation[i].years,
      education: education._id,
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
