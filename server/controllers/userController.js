const User = require('../models/user');
const experienceController = require('./experienceController');
const educationController = require('./educationController');
const skillController = require('./skillController');
const Question = require('../models/question');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const getQuestions = async (user) => {
  const questions = await Question.find({
    $or: [{ sender: user._id }, { receiver: user._id }],
  });
  const sent = questions.filter(
    (q) => q.sender._id.toString() === user._id.toString()
  );
  const received = questions.filter(
    (q) => q.receiver._id.toString() === user._id.toString()
  );

  return { sent, received };
};

exports.encourageMail = async (req, res, next) => {
  const users = await User.find({
    'posts.0': { $exists: true },
    'reviews.0': { $exists: false },
  }).exec();

  for (var i = 0; i < users.length; i++) {
    sendinblue(users[i].email, users[i].username, 5, 1);
  }
};

exports.getAllAdvisors = async (req, res, next) => {
  try {
    let advisors = await User.find({ advisorStatus: 'approved' });
    advisors = advisors.filter(
      (a) => a._id.toString() != req.user._id.toString()
    );

    return res.send(advisors);
  } catch (err) {
    return new Error(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    let udata = await User.findById(req.params.userId);
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

exports.createOrLogin = async (req, res, next) => {
  try {
    const doesUserExist = await User.findOne({
      $or: [{ uid: req.body.uid }, { email: req.body.email }],
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

      const questions = await getQuestions(createdUser, req);
      createdUser.questions = questions;
      return res.send(createdUser);
    } else {
      doesUserExist.authTime = req.body.auth_time;
      await doesUserExist.save();
      const questions = await getQuestions(doesUserExist);
      if(questions){
        doesUserExist.questions = questions;
        console.log(999,doesUserExist.questions)
        let finalUser = JSON.parse(JSON.stringify(doesUserExist));
        finalUser.questions = questions;
        return res.send(finalUser);
      }else{
        return res.send([]);
      }
    }
  } catch (e) {
    next(e);
  }
};

//add device token to user for push notifications
exports.registerToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token || token === '') {
      return res.status(400).json({ message: 'Please provide device token' });
    }
    const user = await User.findById(req.user._id).select('+tokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.tokens.includes(token)) {
      user.tokens.push(token);
      await user.save();
      return res.status(200).json({ message: 'Token register successfully' });
    } else {
      return res.status(200).json({ message: 'Token already registered' });
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
      return res.status(404).json({ message: 'User not found' });
    }

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
          experienceIds.push(experience[i]._id);
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
          educationIds.push(education[i]._id);
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
            console.log(e);
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
      user = await User.findOneAndUpdate({ _id: req.params.userId }, body, {
        new: true,
      });

      const questions = await getQuestions(user, req);

      return res.status(200).json({
        message: 'User updated successfully',
        user: { ...user._doc, questions },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};
exports.searchAutomationResults = async (req, res) => {
  const { search } = req.query;
  const regex = new RegExp(escapeRegex(search));
  console.log("search", search);
    const educationSearchResults = await educationController.search(regex);
    console.log("educationSearchResults", educationSearchResults);
    const skillsSearchResults = await skillController.search(regex);
    console.log("skillsSearchResults", skillsSearchResults);
    const experienceSearchResults = await experienceController.search(regex);
    console.log("experienceSearchResults", experienceSearchResults);
    let results = educationSearchResults
      .map((result) => result.name.toLowerCase())
      .concat(skillsSearchResults.map((result) => result.name.toLowerCase()))
      .concat(
        experienceSearchResults.map((result) => result.name.toLowerCase())
      );
    const uniqueStrings = new Set(results);
    const filteredResults = Array.from(uniqueStrings);
    res.send(filteredResults);
};
exports.search = async (req, res, next) => {
  const toallob = {}; //starting object for education, skill and experience to filter undesired data
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
  const basicFilter = {
    $and: [
      { verified: true },
      {
        $and: [
          {
            // request_settings: { $exists: true },
            "request_settings.concurrent": { $exists: true },
            // "request_settings.concurrent": { $ne: 0 },
          },
        ],
      },
    ],
  };
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
    { $match: basicFilter },
    { $match: budgetFilter },
    { $match: experienceFilter },
    { $match: educationFilter },
  ]).exec();
  console.log(users);
  return res.send(users);
};

exports.favorite = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const favorite = req.params.id;
  const type = req.body.type;
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (type === 'users') {
    const favoritedUser = await User.findOne({ _id: favorite });
    let favorited = false;
    user.favorites.users.forEach((item) => {
      if (item.id.toString() === favorite.toString()) {
        favorited = true;
      }
    });
    if (favorited) {
      user.favorites.users = user.favorites.users.filter(
        (item) => item.id.toString() !== favorite.toString()
      );
    } else {
      user.favorites.users = {
        id: favorite,
        name: favoritedUser.name,
        picture: favoritedUser.picture ?? '',
        title: favoritedUser.title ?? '',
      };
    }
  } else if (type === 'questions') {
    const question = await Question.findById(favorite);
    let favorited = false;
    user.favorites.questions.forEach((item) => {
      if (item.id.toString() === favorite.toString()) {
        favorited = true;
      }
    });
    if (favorited) {
      user.favorites.questions = user.favorites.questions.filter(
        (item) => item.id.toString() !== favorite.toString()
      );
    } else {
      user.favorites.questions.push({
        id: favorite,
        description: question.description,
        senderName: question.sender.name,
        senderPicture: question.sender.picture,
        createdAt: question.createdAt,
        status: question.status,
        endAnswerTime: question.endAnswerTime,
      });
    }
  }
  await user.save();
  return res.status(200).json({ message: 'Favorite updated successfully' });
};

exports.applyForAdvisor = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.advisorStatus = 'pending';
    await user.save();
    return res.status(200).json({ message: 'Application sent successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
