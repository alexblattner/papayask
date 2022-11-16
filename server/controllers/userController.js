const bcrypt = require("bcrypt");
const saltRounds = 10;
const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_APP_ID);


const User = require("../models/user");
const experienceController = require("./experienceController");
const educationController = require("./educationController");



function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const Session = require("../models/session");
const education = require("../models/education");
const experience = require("../models/experience");
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
      .select("+request_settings")
      .populate({
        path: "posts",
        populate: {
          path: "tags",
          model: "Tag",
        },
      })
      .populate({
        path: "reviews",
        populate: {
          path: "post",
          model: "Post",
          populate: {
            path: "tags",
            model: "Tag",
          },
        },
      })
      .populate("votes")
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
    const data = await User.findOneAndUpdate({ uid: req.body.uid },{authTime:req.body.authTime},{
      upsert: true,
      new: true,
    }).exec();
    return res.status(200).send(data);
  } catch (err) {
    return new Error(err);
  }
};
exports.createOrLogin = async (req, res, next) => {
  try {
    const doesUserExist = await User.findOne({$or:[{uid:req.body.uid},{email:req.body.email}]}).exec();
    if (
      !doesUserExist
    ) { 
      const newUserOb={
        uid: req.body.uid,
        name: req.body.displayName,
        email: req.body.email.toLowerCase(),
        confirmed: false,
        authTime: req.body.auth_time,
      }
      if(req.body.photoURL){
        newUserOb.picture=req.body.photoURL;
      }
      const user = new User(newUserOb);
      const createdUser = await user.save();
      return res.send(createdUser);
    } else {
      doesUserExist.authTime=req.body.auth_time;
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
    const user = await User.findById(req.params.userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { bio, experience, education, skills, title, isSetUp } = req.body;

    //create experiences and store their ids in an array
    let experienceIds = [];
    if (experience) {
      for (let i = 0; i < experience.length; i++) {
        const newExperience = await experienceController.create(experience[i], user._id);
        experienceIds.push(newExperience._id);
      }
    }

    //create educations and store their ids in an array
    const educationIds = [];
    if (education) {
      for (let i = 0; i < education.length; i++) {
        const newEducation = await educationController.create(education[i],user._id);
        educationIds.push(newEducation._id);
      }
    }

    //create skills and store their ids in an array
    const skillIds = [];
    if (skills) {
      for (let i = 0; i < skills.length; i++) {
        const newSkill = await skillController.create(skills[i], user._id);
        skillIds.push(newSkill._id);
      }
    }

    await user.findByIdAndUpdate(req.params.userId, {
      bio,
      experience: [... user.experience, ...experienceIds],
      education: [... user.education, ...educationIds],
      skills: [... user.skills, ...skillIds],
      title,
      isSetUp,
    }, { new: true }).exec();
    return res.status(200).json({ message: "User updated successfully" , user});
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}


exports.search = async (req, res, next) => {
  console.log(req.query);
  const toallob={}//starting object for education, skill and experience to filter undesired data
  if(req.query.personal){
    if(req.query.personal.country){//if country is present in query
      toallob.user.country=req.query.personal.country;//add country to user object
    }
    if(req.query.personal.language){//if language is present in query
      toallob.user.language=req.query.personal.language;//add language to user object
    }
  }
  let search={};
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    search = {
      $or: [
        { $and:[{'experience.name': {$exists:true} , 'experience.name': regex}] },
        { $and:[{'skills.name': {$exists:true} , 'skills.name': regex}] },
        { $and:[{'education.name': {$exists:true} , 'education.name': regex}] },
      ]
    }
  }
  if(req.query.budget){
    
  }
  if(req.query.education){

  }
  if(req.query.experience){

  }
  const users = await User.aggregate([
    {
      $match:toallob
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
              }
            }
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
            $unwind: "$university"
          }
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
    {$match:search},
  ]).exec();
  console.log(users);
  return res.send(users);
};