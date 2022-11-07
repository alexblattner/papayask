const bcrypt = require("bcrypt");
const saltRounds = 10;
const fetch = require("node-fetch");
const Question = require("../models/question");
const Note = require("../models/note");
const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_APP_ID);
const mongoose = require("mongoose");
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const Session = require("../models/session");
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
  const { fuzzy } = req.body;
  const regex = new RegExp(escapeRegex(req.params.search), "gi");
  const userS = [];
  const userSearch = await User.find({experience:{$exists:true},education:{$exists:true}}).populate({
    path: 'experience.company',
  }).populate({
    path: 'education.school',
    }).find({$or:[{name: regex},{email: regex},{experience: regex},{education:regex}]}).exec();
  console.log(121,userSearch);
  return res.send(userSearch);
};