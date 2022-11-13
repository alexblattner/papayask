const bcrypt = require("bcrypt");
const saltRounds = 10;
const fetch = require("node-fetch");
const Question = require("../models/question");
const Note = require("../models/note");
const User = require("../models/user");
const Education = require("../models/education");
const Experience = require("../models/experience");
const Skill = require("../models/skill");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_APP_ID);
const mongoose = require("mongoose");
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
    await user.update(req.body);
    return res.status(200).json({ message: "User updated successfully" });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}
exports.search = async (req, res, next) => {
  const toallob={}//starting object for education, skill and experience to filter undesired data
  if(req.query.personal){
    if(req.query.personal.country){//if country is present in query
      toallob.user.country=req.query.personal.country;//add country to user object
    }
    if(req.query.personal.language){//if language is present in query
      toallob.user.language=req.query.personal.language;//add language to user object
    }
  }
  let eduob={};
  let expob={};
  let skillob={};
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    eduob=req.query.degree?{
      $match: {
        'experience.name': req.query.degree,
      },
    }:{};
    expob={
      $match: {
        'experience.name': regex,
      },
    };
    skillob.name={
      $match: {
        'skills.name': regex,
      },
    };
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
    expob
  ]).exec();

  return res.send(users);
};