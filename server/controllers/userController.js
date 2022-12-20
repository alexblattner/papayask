const bcrypt = require("bcrypt");
const saltRounds = 10;
const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_APP_ID);

const User = require("../models/user");
const experienceController = require("./experienceController");
const educationController = require("./educationController");
const skillController = require("./skillController");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

exports.encourageMail = async (req, res, next) => {
  const users = await User.find({
    "posts.0": { $exists: true },
    "reviews.0": { $exists: false },
  }).exec();

  for (var i = 0; i < users.length; i++) {
    sendinblue(users[i].email, users[i].username, 5, 1);
  }
};
exports.getById = async (req, res, next) => {
  try {
    let udata = await User.findById(req.params.id)
      .populate({
        path: "experience",
        populate: { path: "company", model: "Company" },
      })
      .populate({
        path: "education",
        populate: { path: "university", model: "University" },
      })
      .populate({
        path: "skills",
        model: "Skill",
        populate: [
          {
            path: "experiences.experience",
            model: "Experience",
            populate: {
              path: "company",
              model: "Company",
            },
          },
          {
            path: "educations.education",
            model: "Education",
            populate: {
              path: "university",
              model: "University",
            },
          },
        ],
      });

    return res.send(udata);
  } catch (err) {
    return new Error(err);
  }
};
exports.getByEmail = async (req, res, next) => {
  try {
    const data = await User.findOne({ email: req.params.email }).exec();
    return res.send(data);
  } catch (err) {
    return new Error(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const data = await User.findOneAndUpdate(
      { uid: req.body.uid },
      { authTime: req.body.authTime },
      {
        upsert: true,
        new: true,
      }
    )
      .populate({
        path: "experience",
        populate: { path: "company", model: "Company" },
      })
      .populate({
        path: "education",
        populate: { path: "university", model: "University" },
      })
      .populate({
        path: "skills",
        model: "Skill",
        populate: [
          {
            path: "experiences.experience",
            model: "Experience",
            populate: {
              path: "company",
              model: "Company",
            },
          },
          {
            path: "educations.education",
            model: "Education",
            populate: {
              path: "university",
              model: "University",
            },
          },
        ],
      });

    return res.status(200).send(data);
  } catch (err) {
    return new Error(err);
  }
};
exports.createOrLogin = async (req, res, next) => {
  try {
    const doesUserExist = await User.findOne({
      $or: [{ uid: req.body.uid }, { email: req.body.email }],
    })
      .populate({
        path: "experience",
        populate: { path: "company", model: "Company" },
      })
      .populate({
        path: "education",
        populate: { path: "university", model: "University" },
      })
      .populate({
        path: "skills",
        model: "Skill",
        populate: [
          {
            path: "experiences.experience",
            model: "Experience",
            populate: {
              path: "company",
              model: "Company",
            },
          },
          {
            path: "educations.education",
            model: "Education",
            populate: {
              path: "university",
              model: "University",
            },
          },
        ],
      });

    if (!doesUserExist) {
      const newUserOb = {
        uid: req.body.uid,
        name: req.body.displayName,
        email: req.body.email.toLowerCase(),
        confirmed: false,
        authTime: req.body.auth_time,
      };
      if (req.body.photoURL) {
        newUserOb.picture = req.body.photoURL;
      }
      const user = new User(newUserOb);
      const createdUser = await user.save();

      return res.send(createdUser);
    } else {
      doesUserExist.authTime = req.body.auth_time;
      await doesUserExist.save();
      return res.send(doesUserExist);
    }
  } catch (e) {
    next(e);
  }
};

//add device token to user for push notifications
exports.registerToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token || token === "") {
      return res.status(400).json({ message: "Please provide device token" });
    }
    const user = await User.findById(req.params.userId).select("+tokens");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.tokens.includes(token)) {
      user.tokens.push(token);
      await user.save();
      return res.status(200).json({ message: "Token register successfully" });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

//update user
exports.update = async (req, res) => {
  try {
    let user = await User.findById(req.params.userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(req.body);

    const {
      bio,
      experience,
      education,
      skills,
      title,
      isSetUp,
      languages,
      country,
      picture,
      request_settings,
      questionsInstructions,
    } = req.body;

    //create experiences and store their ids in an array
    let experienceIds = [];
    if (experience) {
      for (let i = 0; i < experience.length; i++) {
        if (experience[i]._id) {
          const id = await experienceController.update(experience[i], user._id);
          experienceIds.push(id);
        } else {
          try {
            const newExperience = await experienceController.create(
              experience[i],
              user._id
            );
            experienceIds.push(newExperience._id);
          } catch (e) {
            console.log(e);
          }
        }
      }
    }

    //create educations and store their ids in an array
    const educationIds = [];
    if (education) {
      for (let i = 0; i < education.length; i++) {
        if (education[i]._id) {
          const id = await educationController.update(education[i], user._id);
          educationIds.push(id);
        } else {
          try {
            const newEducation = await educationController.create(
              education[i],
              user._id
            );
            educationIds.push(newEducation._id);
          } catch (e) {
            console.log(e);
          }
        }
      }
    }

    //create skills and store their ids in an array
    const skillIds = [];
    if (skills) {
      for (let i = 0; i < skills.length; i++) {
        if (skills[i]._id) {
          const updatedSkill = await skillController.update(skills[i]);
          skillIds.push(updatedSkill._id);
        } else {
          try {
            const newSkill = await skillController.create(skills[i]);
            skillIds.push(newSkill._id);
          } catch (e) {
            // console.log(e);
          }
        }
      }
    }

    const body = {
      bio,
      experience: experience ? experienceIds : undefined,
      education: education ? educationIds : undefined,
      skills: skills ? skillIds : undefined,
      title,
      isSetUp,
      languages,
      country,
      picture,
      request_settings,
      questionsInstructions,
    };

    try {
      user = await User.findByIdAndUpdate(req.params.userId, body, {
        new: true,
      })
        .populate({
          path: "experience",
          populate: { path: "company", model: "Company" },
        })
        .populate({
          path: "education",
          populate: { path: "university", model: "University" },
        })
        .populate({
          path: "skills",
          model: "Skill",
          populate: [
            {
              path: "experiences.experience",
              model: "Experience",
              populate: {
                path: "company",
                model: "Company",
              },
            },
            {
              path: "educations.education",
              model: "Education",
              populate: {
                path: "university",
                model: "University",
              },
            },
          ],
        });

      return res
        .status(200)
        .json({ message: "User updated successfully", user });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

exports.search = async (req, res, next) => {
  const toallob = {
    $and: [
      {
        verified: true,
      },
      // {
      //   "request_settings.concurrent": { $exists: true },
      // },
    ],
  }; //starting object for education, skill and experience to filter undesired data
  const { search, budget, personal, education, experience } = req.query;

  if (req.query.personal) {
    if (personal.country) {
      //if country is present in query
      toallob.user.country = req.query.personal.country; //add country to user object
    }
    if (personal.language) {
      //if language is present in query
      toallob.user.language = req.query.personal.language; //add language to user object
    }
  }
  let searchFilter = {};
  // const basicFilter = {
  //   $and: [
  //     {
  //       verified: true,
  //     },
  //     {
  //       "request_settings.concurrent": { $exists: true },
  //     },
  //   ],
  // };
  if (search) {
    const regex = new RegExp(escapeRegex(search), "gi");
    searchFilter = {
      $or: [
        {
          $and: [
            {
              "experience.name": { $exists: true },
              "experience.name": regex,
            },
          ],
        },
        {
          $and: [{ "skills.name": { $exists: true }, "skills.name": regex }],
        },
        {
          $and: [
            {
              "education.name": { $exists: true },
              "education.name": regex,
            },
          ],
        },
      ],
    };
  }
  let budgetFilter = {};
  if (budget && !(budget[0] == 0 && budget[1] == 1)) {
    // if (budget[0] == 0 && budget[1] == 1) return;
    budgetFilter = {
      $and: [
        { "request_settings.cost": { $gte: budget[0] } },
        { "request_settings.cost": { $lte: budget[1] } },
      ],
    };
  }
  let educationFilter = {};
  if (education && education.name != "") {
    const regex = new RegExp(escapeRegex(education), "gi");
    educationFilter = {
      $and: [
        {
          "education.name": { $exists: true },
          "education.name": regex,
        },
      ],
    };
  }
  let experienceFilter = {};
  if (experience && experience.name != "") {
    experienceFilter = {
      $and: [
        {
          "experience.name": { $exists: true },
          "experience.name": regex,
        },
      ],
    };
  }

  const users = await User.aggregate([
    {
      $match: toallob,
    },
    {
      $lookup: {
        from: "experiences",
        localField: "experience",
        foreignField: "_id",
        as: "experience",
      },
    },
    {
      $lookup: {
        from: "educations",
        let: { education: "$education" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$education"],
              },
            },
          },
          {
            $lookup: {
              from: "universities",
              localField: "university",
              foreignField: "_id",
              as: "university",
            },
          },
          {
            $unwind: "$university",
          },
        ],
        as: "education",
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "skills",
        foreignField: "_id",
        as: "skills",
      },
    },
    { $match: searchFilter },
    // { $match: basicFilter },
    // { $match: budgetFilter },
    // { $match: experienceFilter },
    // { $match: educationFilter },
  ]).exec();
  console.log("users", users);
  return res.send(users);
};

exports.searchAutomationResults = async (req, res) => {
  const { search } = req.query;
  const regex = new RegExp(escapeRegex(search));
  console.log("search", search);
  try {
    const educationSearchResults = await educationController.search(regex);
    const skillsSearchResults = await skillController.search(regex);
    const experienceSearchResults = await experienceController.search(regex);
    let results = educationSearchResults
      .map((result) => result.name.toLowerCase())
      .concat(skillsSearchResults.map((result) => result.name.toLowerCase()))
      .concat(
        experienceSearchResults.map((result) => result.name.toLowerCase())
      );
    const uniqueStrings = new Set(results);
    const filteredResults = Array.from(uniqueStrings);
    res.send(filteredResults);
  } catch (e) {
    res.send([]);
  }
};
exports.apply = async (req, res, next) => {
  if (user) {
    let completion = 0;
    if (user.title) {
      completion += 5;
    }
    if (user.bio) {
      completion += 15;
    }
    if (user.picture) {
      completion += 15;
    }
    for (let i = 0; i < user.skills.length; i++) {
      if (
        user.skills[i].experiences.length > 0 ||
        user.skills[i].educations.length > 0
      ) {
        completion += 10;
      } else {
        completion += 5;
      }
    }
    for (let i = 0; i < user.experience.length; i++) {
      completion += 5;
    }
    for (let i = 0; i < user.education.length; i++) {
      completion += 5;
    }
    if (completion > 65) {
      user.isSetUp = true;
    } else {
      user.isSetUp = false;
    }
    user.save();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
