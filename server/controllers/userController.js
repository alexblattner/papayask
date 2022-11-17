const bcrypt = require('bcrypt');
const saltRounds = 10;
const fetch = require('node-fetch');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_APP_ID);

const User = require('../models/user');
const experienceController = require('./experienceController');
const educationController = require('./educationController');
const skillController = require('./skillController');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const Session = require('../models/session');

exports.encourageMail = async (req, res, next) => {
  const users = await User.find({
    'posts.0': { $exists: true },
    'reviews.0': { $exists: false },
  }).exec();

  for (var i = 0; i < users.length; i++) {
    sendinblue(users[i].email, users[i].username, 5, 1);
  }
};
exports.getById = async (req, res, next) => {
  try {
    let udata = await User.findById(req.params.id)
      .select('+request_settings')
      .populate({
        path: 'posts',
        populate: {
          path: 'tags',
          model: 'Tag',
        },
      })
      .populate({
        path: 'reviews',
        populate: {
          path: 'post',
          model: 'Post',
          populate: {
            path: 'tags',
            model: 'Tag',
          },
        },
      })
      .populate('votes')
      .exec();
    const rqst = await Direct_request.find({ to: udata._id }).exec();
    let fudata = JSON.parse(JSON.stringify(udata));
    fudata.requests = rqst.length;
    // udata.votes = revsVotes;

    return res.send(fudata);
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
        path: 'experience',
        populate: { path: 'company', model: 'Company' },
      })
      .populate({
        path: 'education',
        populate: { path: 'university', model: 'University' },
      })
      .populate({
        path: 'skills',
        model: 'Skill',
        populate: [
          {
            path: 'experiences.experience',
            model: 'Experience',
            populate: {
              path: 'company',
              model: 'Company',
            },
          },
          {
            path: 'educations.education',
            model: 'Education',
            populate: {
              path: 'university',
              model: 'University',
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
        path: 'experience',
        populate: { path: 'company', model: 'Company' },
      })
      .populate({
        path: 'education',
        populate: { path: 'university', model: 'University' },
      })
      .populate({
        path: 'skills',
        model: 'Skill',
        populate: [
          {
            path: 'experiences.experience',
            model: 'Experience',
            populate: {
              path: 'company',
              model: 'Company',
            },
          },
          {
            path: 'educations.education',
            model: 'Education',
            populate: {
              path: 'university',
              model: 'University',
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
      const createdUser = await user
        .save()
        .populate({
          path: 'experience',
          populate: { path: 'company', model: 'Company' },
        })
        .populate({
          path: 'education',
          populate: { path: 'university', model: 'University' },
        })
        .populate({
          path: 'skills',
          model: 'Skill',
          populate: [
            {
              path: 'experiences.experience',
              model: 'Experience',
              populate: {
                path: 'company',
                model: 'Company',
              },
            },
            {
              path: 'educations.education',
              model: 'Education',
              populate: {
                path: 'university',
                model: 'University',
              },
            },
          ],
        });

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
    if (!token || token === '') {
      return res.status(400).json({ message: 'Please provide device token' });
    }
    const user = await User.findById(req.params.userId).select('+tokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.tokens.includes(token)) {
      user.tokens.push(token);
      await user.save();
      return res.status(200).json({ message: 'Token register successfully' });
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
    } = req.body;

    //create experiences and store their ids in an array
    let experienceIds = [];
    if (experience) {
      for (let i = 0; i < experience.length; i++) {
        if (experience[i]._id) {
          experienceIds.push(experience[i]._id);
        } else {
          try {
            console.log(user._id);
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
        try {
          const newSkill = await skillController.create(skills[i], user._id);
          skillIds.push(newSkill._id);
        } catch (e) {
          console.log(e);
        }
      }
    }

    const body = {
      bio,
      experience: experienceIds,
      education: educationIds,
      skills: skillIds,
      title,
      isSetUp,
      languages,
      country,
    };

    try {
      user = await User.findByIdAndUpdate(req.params.userId, body, {
        new: true,
      })
        .populate({
          path: 'experience',
          populate: { path: 'company', model: 'Company' },
        })
        .populate({
          path: 'education',
          populate: { path: 'university', model: 'University' },
        })
        .populate({
          path: 'skills',
          model: 'Skill',
          populate: [
            {
              path: 'experiences.experience',
              model: 'Experience',
              populate: {
                path: 'company',
                model: 'Company',
              },
            },
            {
              path: 'educations.education',
              model: 'Education',
              populate: {
                path: 'university',
                model: 'University',
              },
            },
          ],
        });

      return res
        .status(200)
        .json({ message: 'User updated successfully', user });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

exports.search = async (req, res, next) => {
  const toallob = {}; //starting object for education, skill and experience to filter undesired data
  if (req.query.personal) {
    if (req.query.personal.country) {
      //if country is present in query
      toallob.user.country = req.query.personal.country; //add country to user object
    }
    if (req.query.personal.language) {
      //if language is present in query
      toallob.user.language = req.query.personal.language; //add language to user object
    }
  }
  let eduob = {};
  let expob = {};
  let skillob = {};
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    eduob = req.query.degree
      ? {
          $match: {
            'experience.name': req.query.degree,
          },
        }
      : {};
    expob = {
      $match: {
        'experience.name': regex,
      },
    };
    skillob.name = {
      $match: {
        'skills.name': regex,
      },
    };
  }
  if (req.query.budget) {
  }
  if (req.query.education) {
  }
  if (req.query.experience) {
  }
  const users = await User.aggregate([
    {
      $match: toallob,
    },
    {
      $lookup: {
        from: 'experiences',
        localField: 'experience',
        foreignField: '_id',
        as: 'experience',
      },
    },
    expob,
  ]).exec();

  return res.send(users);
};
