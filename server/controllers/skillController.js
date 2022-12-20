const Skill = require("../models/skill");
const Experience = require("../models/experience");
const Education = require("../models/education");

exports.create = async (skill, userId) => {
  const { educations, experiences } = skill;
  let experienceList = [];
  for (let i = 0; i < experiences.length; i++) {
    const exp = await Experience.findOne({
      name: experiences[i].experience.name,
      startDate: experiences[i].experience.startDate,
      endDate: experiences[i].experience.endDate,
    }).exec();
    experienceList.push({
      years: experiences[i].years,
      experience: exp._id,
    });
  }
  let educationList = [];
  for (let i = 0; i < educations.length; i++) {
    const edu = await Education.findOne({
      name: educations[i].education.name,
      startDate: educations[i].education.startDate,
      endDate: educations[i].education.endDate,
    }).exec();
    educationList.push({
      years: educations[i].years,
      education: edu._id,
    });
  }

  const newSkill = await Skill.create({
    user: userId,
    experiences: experienceList,
    educations: educationList,
    ...skill,
  });
  return newSkill;
};

exports.update = async (skill) => {
  const { educations, experiences } = skill;
  let experienceList = [];
  for (let i = 0; i < experiences.length; i++) {
    const exp = await Experience.findOne({
      name: experiences[i].experience.name,
      startDate: experiences[i].experience.startDate,
      endDate: experiences[i].experience.endDate,
    }).exec();
    experienceList.push({
      years: experiences[i].years,
      experience: exp._id,
    });
  }
  let educationList = [];
  for (let i = 0; i < educations.length; i++) {
    const edu = await Education.findOne({
      name: educations[i].education.name,
      startDate: educations[i].education.startDate,
      endDate: educations[i].education.endDate,
    }).exec();
    educationList.push({
      years: educations[i].years,
      education: edu._id,
    });
  }
  const updateSkill = await Skill.findByIdAndUpdate(
    skill._id,
    {
      $set: {
        ...skill,
        experiences: experienceList,
        educations: educationList,
      },
    },
    { new: true }
  ).exec();
  return updateSkill;
};

exports.search = async (searchText) => {
  try {
    const searchResults = await Skill.find({ name: searchText });
    return searchResults;
  } catch (e) {
    return [];
  }
};
