const bcrypt = require("bcrypt");
const saltRounds = 10;
const fetch = require("node-fetch");
const Question = require("../models/question");
const Note = require("../models/note");
const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_APP_ID);
const mongoose = require("mongoose");


const Session = require("../models/session");
async function rewardsSetUp(user) {
  let rewardsarr=[]
  let voteob={1:{amount:1,complete:false},50:{amount:5,complete:false},
  100:{amount:10,complete:false},200:{amount:15,complete:false},500:{amount:30,complete:false},
  1000:{amount:100,complete:false},10000:{amount:1000,complete:false},
  100000:{amount:10000,complete:false},1000000:{amount:100000,complete:false}}
  rewardsarr.push({user:user._id,progress:[],rewards:voteob,type:"vote"})
  let revsob={1:{amount:5,complete:false},10:{amount:10,complete:false},50:{amount:40,complete:false},
  100:{amount:50,complete:false},200:{amount:100,complete:false},500:{amount:300,complete:false},
  1000:{amount:500,complete:false},10000:{amount:10000,complete:false},100000:{amount:100000,complete:false}}
  rewardsarr.push({user:user._id,progress:[],rewards:revsob,type:"review"})
  let qob={1:{amount:10,complete:false},5:{amount:20,complete:false},10:{amount:25,complete:false},
  50:{amount:200,complete:false},100:{amount:250,complete:false},200:{amount:500,complete:false},
  500:{amount:1500,complete:false},1000:{amount:2500,complete:false},10000:{amount:50000,complete:false}}
  rewardsarr.push({user:user._id,progress:[],rewards:qob,type:"quality"})
  let comob={1:{amount:2,complete:false},50:{amount:10,complete:false},100:{amount:10,complete:false},
  200:{amount:20,complete:false},500:{amount:60,complete:false},1000:{amount:200,complete:false},
  10000:{amount:2000,complete:false},100000:{amount:20000,complete:false}}
  rewardsarr.push({user:user._id,progress:[],rewards:comob,type:"comment"})
  await Reward.insertMany(rewardsarr)
}
exports.resendEmail = async (req, res, next) => {
  if (req.session.uid != undefined) {
    const user = await User.findById(req.session.uid).select("+email").exec();
    if (user) {
      const mail = await Mail.findOne({ user: user._id }).exec();
      if (mail) {
        sendinblue(user.email, user.username, 1, mail._id);
        return res.send(mail);
      } else {
        return res.sendStatus(404);
      }
    } else {
      return res.sendStatus(404);
    }
  } else {
    return res.sendStatus(407);
  }
};
exports.getTop = async (req, res, next) => {
  let date = new Date();
  if (req.body.time == "hour") {
    date = new Date(date.getTime() - 60 * 60 * 1000);
  } else if (req.body.time == "day") {
    date = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  } else if (req.body.time == "week") {
    date = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (req.body.time == "month") {
    date = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (req.body.time == "year") {
    date = new Date(date.getTime() - 365 * 24 * 60 * 60 * 1000);
  } else {
    date = null;
  }
    let arr=[]
    if(req.session.uid)
    arr.push({$match:{_id:{$ne:mongoose.Types.ObjectId(req.session.uid)}}})
    let revs=[]
    if(req.body.tag){
      let tag=await Tag.findOne({name:req.body.tag}).exec()
      revs.push(mongoose.Types.ObjectId(tag._id))
    }else if(req.session.uid){
      let int=await InterestScore.find({user:req.session.uid,score:{$gt:0}}).exec()
      revs.push(...int.map(i=>mongoose.Types.ObjectId(i._id)))
    }
    if(req.session.uid){
      arr.push({$lookup: {
        from: "votes",
        let: { receiverId: "$_id" },
        pipeline: [
          {
            $match: {$and:[{$expr: {
              $eq: ["$receiver", {$toObjectId: "$$receiverId"}],
            }},{$expr:{$ne:[{$setIntersection: ["$tags", revs]},null]}}]},
          }
        ],
        as: "temp"
      },
    },{$addFields:{
      score: {$sum:[{$sum: "$temp.points"},{$multiply: [{$size:{
        $setIntersection: ["$expertise", revs]
        }},20]}]}
      }},{$match:{score:{$gt:0}}},{$sort:{score:-1}})
    }
    arr.push({$lookup:{
      from: "direct_requests",
      let: { to: "$_id" },
      pipeline: [
        {$match:{to:"$$to",done:false,time_limit:{$gt:new Date()}}},
      ],
      as: "requestCount"
    }},{$addFields:{
      dr: {$size: "$requestCount"}
    }},{$match:{$expr: { $gt: [ "$request_settings.concurrent" , "$dr" ] } }},
    {
      $project: {
        "password": 0,
        "updatedAt": 0,
        "email": 0,
        "createdAt": 0,
        "confirmed": 0,
        "postsAllowed": 0,
        "reviewsToPost": 0,
        "reviews": 0,
        "posts": 0,
        "comments": 0,
        "votes": 0,
        "balance": 0,
        "tempdr": 0,
        "dr": 0,
        "temp": 0,
        "isSetUp": 0,
        "tokens": 0,
      },
    })
    if(!req.session.uid){
      arr.push({$sort:{reputation:-1}})
    }
    const users =await User.aggregate(arr).limit(6).exec();
    return res.send(users);
};
exports.resetLoginMail = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.mail }).exec();
  if (user) {
    let now = new Date();
    now.setDate(now.getDate() + 14);
    const code = await Mail.create({
      expiration: now,
      type: 4,
      user: user._id,
    });
    const sent = await sendinblue(req.body.mail, user.username, 4, code._id);
    if (sent) return res.sendStatus(200);
    else return res.sendStatus(400);
  } else {
    res.sendStatus(404);
  }
};
exports.resetLogin = async (req, res, next) => {
  if (req.params.code != undefined) {
    var url = require("url");
    const mail = await Mail.findById(req.params.code).exec();
    if (mail) {
      const exists = await User.findById(mail.user).exec();
      if (exists) {
        await User.findByIdAndUpdate(mail.user, { password: "" });
        const user = await User.findById(mail.user).exec();
        await Mail.deleteMany({ user: mail.user, type: 4 });

        function getFormattedUrl() {
          return url.format({
            protocol: process.env.NODE_ENV == "development" ? "http" : "https",
            host:
              process.env.NODE_ENV == "development"
                ? "localhost:3000"
                : process.env.NODE_ENV == "production"
                ? "snipcritics.com"
                : "scbackend.com",
            pathname: "/log-in",
          });
        }
        res.redirect(getFormattedUrl());
      }
    } else {
      function getFormattedUrl() {
        return url.format({
          protocol: process.env.NODE_ENV == "development" ? "http" : "https",
          host:
            process.env.NODE_ENV == "development"
              ? "localhost:3000"
              : process.env.NODE_ENV == "production"
              ? "snipcritics.com"
              : "scbackend.com",
        });
      }
      res.redirect(getFormattedUrl());
    }
  } else {
    return res.sendStatus(400);
  }
};
exports.encourageMail = async (req, res, next) => {
  const users = await User.find({
    "posts.0": { $exists: true },
    "reviews.0": { $exists: false },
  }).exec();

  for (var i = 0; i < users.length; i++) {
    sendinblue(users[i].email, users[i].username, 5, 1);
  }
};
exports.updateMail = async (req, res, next) => {
  var date = new Date(new Date() - 1000 * 60 * 60 * 24 * 15);
  const users = await User.find({ updatedAt: { $lt: date } }).exec();
  for (var i = 0; i < users.length; i++) {
    sendinblue(users[i].email, users[i].username, 3, 1);
  }
};
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({
    $or: [{ username: req.body.email }, { email: req.body.email }],
  })
    .select("email")
    .select("username")
    .exec();
  if (user) {
    let now = new Date();
    now.setDate(now.getDate() + 14);
    const code = await Mail.create({
      expiration: now,
      type: 2,
      user: user._id,
    });
    sendinblue(user.email, user.username, 2, code._id, "password reset");
    return res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};
exports.resetPassword = async (req, res, next) => {
  if (
    req.body.code != undefined &&
    req.body.password != undefined &&
    req.body.confirm != undefined
  ) {
    const mail = await Mail.findById(req.body.code).exec();
    if (
      mail &&
      req.body.password == req.body.confirm &&
      req.body.password.length > 5
    ) {
      const exists = await User.findById(mail.user).exec();
      if (exists) {
        const password = await bcrypt.hashSync(req.body.password, saltRounds);
        await User.findByIdAndUpdate(mail.user, { password: password });
        const user = await User.findById(mail.user).exec();
        await Mail.deleteMany({ user: mail.user, type: 2 });
        req.session.uid = user._id.toString();
        return res.send(req.session.uid);
      } else {
        return res.sendStatus(404);
      }
    } else {
      res.sendStatus(404);
    }
  } else {
    return res.sendStatus(400);
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
exports.getByIdOrUsername = async (req, res, next) => {
  try {
    let udata = await User.findOne({username:req.params.idorusername})
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
      .populate("votes").populate('expertise')
      .exec();
    if(!udata){
        udata = await User.findById(req.params.idorusername)
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
      .populate("votes").populate('expertise')
      .exec();
    }
    const rqst = await Direct_request.find({ to: udata._id }).exec();
    let fudata = JSON.parse(JSON.stringify(udata));
    let exp=[]
    for(var i=0;i<udata.expertise.length;i++){
      exp.push(udata.expertise[i].name)
    }
    fudata.expertise=exp;
    fudata.requests = rqst.length;
    // udata.votes = revsVotes;

    return res.send(fudata);
  } catch (err) {
    return new Error(err);
  }
};
exports.getByUsername = async (req, res, next) => {
  try {
    const data = await User.findOne({ username: req.params.username }).exec();
    return res.send(data);
  } catch (err) {
    return new Error(err);
  }
};
exports.changeUsername = async (req, res, next) => {
  if (req.session.uid != undefined) {
    try {
      const checking_availability = await User.find({
        username: req.body.username,
      }).exec();
      if (checking_availability.length == 0) {
        if (
          /^[0-9a-zA-Z_.-]+$/.test(req.body.username) &&
          req.body.username.length <= 20
        ) {
          const data = await User.findById(req.session.uid);
          data.username = req.body.username.toLowerCase();
          await data.save();
          return res.send(data);
        } else {
          return res.send({ error: 409 });
        }
      } else {
        return res.send({ error: 409 });
      }
    } catch (err) {
      return new Error(err);
    }
  } else {
    return res.json({ error: 407 });
  }
};
exports.loggedIn = async (req, res, next) => {
  if (req.session.uid != undefined) {
    const ses = await Session.find({ sessionId: req.cookies.userId });

    if (ses.length === 0) {
      await Session.create({
        sessionId: req.cookies.userId,
        userId: req.session.uid,  
      });
    }

    const udata = await User.findById(req.session.uid)
      .select("+balance +request_settings")
      .exec();
    await User.updateOne(
      { _id: req.session.uid },
      { lastLogIn: new Date().toISOString() }
    ).exec();
    const follow = await Follow.find({ user: udata }).exec();
    const tracker = await Tracker.find({ tracker: udata }).exec();
    const fid = [];
    const tid = [];
    for (var i = 0; i < tracker.length; i++) {
      tid.push(tracker[i].tracked);
    }
    for (var i = 0; i < follow.length; i++) {
      let tag = await Tag.findById(follow[i].followed).exec();
      if (tag) fid.push(tag.name);
      else fid.push(follow[i].followed.toString());
    }
    let obj = { ...udata };
    obj = obj._doc;
    obj.sessionId = req.cookies.userId;
    if (fid.length > 0) obj.follow = fid;
    if (tid.length > 0) obj.tracking = tid;
    return res.send(obj);
  } else {
    return res.json({ error: 407 });
  }
};
exports.apple = async (req, res) => {
  const { appleId, email } = req.body;
  const user = await User.findOne({ appleId });
  //if it's the first apple sign up for this user
  if (!user) {
    //check if the user already signed up with this email
    const emailUser = await User.findOne({ email });
    if (emailUser) {
      //add appleId for this user for future sign in
      emailUser.appleId = appleId;
      await emailUser.save();
      req.session.uid = emailUser._id;
      return res.json(req.session.uid);
    } else {
      //if user doesn't exist create new user
      let password = email + appleId.substring(2, 6);
      password = await bcrypt.hashSync(password, saltRounds);
      const newUser = await User.create({
        username: '',
        password: password,
        email: email,
        reputation: 0,
        confirmed: true,
        postsAllowed: process.env.POSTS_ALLOWED,
        reviewsToPost: process.env.REVIEWS_TO_POSTS,
        picture: '',
      });
      req.session.uid = newUser._id;
      return res.json(req.session.uid);
    }
  } else {
    //if user exists with this appleId
    req.session.uid = user._id;
    return res.json(req.session.uid);
  }
};
exports.google = async (req, res, next) => {
  const { tokenId, os } = req.body;
  if (tokenId) {
    client
      .verifyIdToken({
        idToken: tokenId,
        audience:
          os == "ios"
            ? process.env.GOOGLE_APP_ID_IOS
            : process.env.GOOGLE_APP_ID,
      })
      .then(async (response) => {
        const { email_verified, picture, email } = response.payload;
        if (email_verified) {
          const user = await User.findOne({ email: email })
            .select("password")
            .exec();
          var password = email + process.env.GOOGLE_APP_ID.substring(2, 6);
          if (user && user.password != "") {
            const p = await bcrypt.compareSync(password, user.password);
            if (p) {
              req.session.uid = user._id;
              return res.json(req.session.uid);
            } else {
              return res.status(417).send(email);
            }
          } else if (user && user.password == "") {
            password = await bcrypt.hashSync(password, saltRounds);
            await user.update({ password: password });
            req.session.uid = user._id;
            return res.json(req.session.uid);
          } else {
            password = await bcrypt.hashSync(password, saltRounds);
            const newUser = await User.create({
              username: "",
              password: password,
              email: email,
              reputation: 0,
              confirmed: true,
              postsAllowed: process.env.POSTS_ALLOWED,
              reviewsToPost: process.env.REVIEWS_TO_POSTS,
              picture: picture,
            });
            req.session.uid = newUser._id;
            await rewardsSetUp(newUser);
            return res.json(req.session.uid);
          }
        } else {
          return res.sendStatus(412);
        }
      });
  } else {
    return res.sendStatus(412);
  }
};
exports.facebook = async (req, res, next) => {
  const { userID, accessToken } = req.body;
  let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,email,picture&access_token=${accessToken}`;
  fetch(urlGraphFacebook, { method: "GET" })
    .then((res) => res.json())
    .then(async (result) => {
      const { picture, email } = result;
      const user = await User.findOne({ email: email })
        .select("password")
        .exec();
      var password = email + process.env.FACEBOOK_APP_ID.substring(2, 6);
      if (user && user.password != "") {
        req.session.uid = user._id;
        return res.json(req.session.uid);
      } else if (user && user.password == "") {
        password = await bcrypt.hashSync(password, saltRounds);
        await user.update({ password: password });
        req.session.uid = user._id;
        return res.json(req.session.uid);
      } else {
        password = await bcrypt.hashSync(password, saltRounds);
        const newUser = await User.create({
          username: "",
          password: password,
          email: email,
          reputation: 0,
          confirmed: true,
          postsAllowed: process.env.POSTS_ALLOWED,
          reviewsToPost: process.env.REVIEWS_TO_POSTS,
          picture: picture.data.url,
        });
        req.session.uid = newUser._id;
        await rewardsSetUp(newUser);
        return res.json(req.session.uid);
      }
    });
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
exports.emailConfirmation = async (req, res, next) => {
  const mail = await Mail.findById(req.params.code).exec();
  if (mail) {
    const user = await User.findById(mail.user);
    if (user) {
      user.confirmed = true;
      await user.save();
      await mail.delete();
      req.session.uid = user._id;
      var url = require("url");

      function getFormattedUrl() {
        return url.format({
          protocol: process.env.NODE_ENV == "development" ? "http" : "https",
          host:
            process.env.NODE_ENV == "development"
              ? "localhost:3000"
              : process.env.NODE_ENV == "production"
              ? "snipcritics.com"
              : "scbackend.com",
        });
      }

      res.redirect(getFormattedUrl());
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
};
exports.create = async (req, res, next) => {
  console.log(1212,req.body);
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
      return res.json(createdUser.uid);
    } else {
      return res.json({ error: 406 });
    }
  } catch (e) {
    next(e);
  }
};
exports.getAll = (req, res, next) => {
  User.find({}, (error, subscribers) => {
    if (error) next(error);
    req.data = subscribers;
    next();
  });
};

/** TWITTER AUTH ROUTES */

//OAuth Step 1
exports.twitter_request_token = async (req, res) => {
  try {
    const { oauth_token, oauth_token_secret } = await getOAuthRequestToken();

    req.session.oauthRequestToken = oauth_token;
    req.session.oauthRequestTokenSecret = oauth_token_secret;

    const redirect_url = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
    return res.json({ redirect_url });
  } catch (err) {
    console.log(`err`, err);
  }
};

//OAuth Step 3
exports.twitter_access_token = async (req, res) => {
  try {
    const { oauth_token: req_oauth_token, oauth_verifier } = req.body;
    const oauth_token = req.session.oauthRequestToken;
    const oauth_token_secret = req.session.oauthRequestTokenSecret;
    if (oauth_token !== req_oauth_token) {
      res.status(403).json({ message: "Request tokens do not match" });
      return;
    }

    const { oauth_access_token, oauth_access_token_secret, results } =
      await getOAuthAccessToken(
        oauth_token,
        oauth_token_secret,
        oauth_verifier
      );
    const { user_id } = results;
    const { data: stringifyData, response } = await getProtectedResource(
      "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
      "GET",
      oauth_access_token,
      oauth_access_token_secret
    );
    const data = JSON.parse(stringifyData);
    const username = data.screen_name;
    const uid = data.id;
    const picture = data.profile_image_url_https;
    const email = data.email;
    const email_verified = data.verified;

    const user = await User.findOne({ email: email }).select("password").exec();
    var password = email + process.env.TWITTER_APP_ID.substring(2, 6);
    if (user && user.password != "") {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.uid = user._id;
        return res.json(req.session.uid);
      } else {
        return res.json({ error: 417 });
      }
    } else if (user && user.password == "") {
      password = await bcrypt.hashSync(password, saltRounds);
      await user.update({ password: password });
      req.session.uid = user._id;
      return res.json(req.session.uid);
    } else {
      password = await bcrypt.hashSync(password, saltRounds);
      const checkusername = await User.findOne({ username: username }).exec();
      let newusername = checkusername ? "" : username;
      const newUser = await User.create({
        username: newusername,
        password: password,
        email: email,
        reputation: 0,
        confirmed: true,
        postsAllowed: process.env.POSTS_ALLOWED,
        reviewsToPost: process.env.REVIEWS_TO_POSTS,
        picture: picture,
      });
      req.session.uid = newUser._id;
      return res.json({ success: true, uid: req.session.uid });
    }
  } catch (error) {
    res.status(403).json({ message: "Missing access token" });
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

//get all users for chat
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(" username picture");
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}
