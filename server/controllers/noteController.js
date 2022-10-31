const Question = require("../models/question");
const Note = require("../models/note");
const User = require("../models/user");
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const { streamSessionsList } = require("../main");
const questionController = require("./questionController");

exports.deleteAll = (req, res, next) => {
  Review.deleteMany()
    .then(() => {
      req.data = "gone";
      next();
    })
    .catch((e) => {
      next(e.message);
      return [];
    });
};
exports.delete = async (req, res, next) => {
  if (req.session.uid) {
    const review = await Review.findOne({
      user: req.session.uid,
      _id: req.body.id,
    }).exec();
    if (review) {
      const postId = review.post;
      const currentuser = await User.findById(req.session.uid).updateOne({
        $pullAll: { reviews: [review._id] },
      }); //get owner of post + update him
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $pullAll: { reviews: [review._id] } },
        { new: true }
      ).exec(); //get all reviews associated with post
      const comments = await Comment.find({ review: review }); //get all comments associated with post
      const commentIds = [];
      comments.forEach(async (comment, i) => {
        await Notification.deleteMany({ target: comment._id.toString() });
        await User.updateOne(
          { _id: comment.user },
          { $pullAll: { comments: commentIds } }
        ); //remove comment from comments collection of owner of comment
        commentIds.push(comment._id);
      });
      await Vote.deleteMany({ review: review });
      await Notification.deleteMany({ target: review._id.toString() });
      await Report.deleteMany({ reported: review._id.toString() });
      await Tracker.deleteMany({ tracked: review.post.toString() });
      await Post.updateOne(
        { _id: postId },
        { $pullAll: { comments: commentIds } }
      ); //remove comment from comments collection of owner of comment
      await review.delete(); //delete post
      return res.send(post);
    } else {
      return res.json({ error: 403 });
    }
  } else {
    return res.json({ error: 407 });
  }
};
exports.postById = async (req, res, next) => {
  const review = await Review.findById(req.params.id).exec();
  if (review) {
    if (req.session && req.session.uid && req.params.id)
      await Notification.updateMany(
        { receiver: req.session.uid, target: req.params.id },
        { viewed: true }
      );
    const post = await Post.findById(review.post)
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "user",
        model: "User",
      })
      .populate({
        path: "tags",
        model: "Tag",
      })
      .exec();
    const newpost = JSON.parse(JSON.stringify(post));
    newpost.reviewTarget = review._id;
    let votes = await Vote.find({ post: post._id }).exec();
    newpost.uservotes = { 5: [], "-2": [], "-1": [], 0: [], 1: [], 2: [] };
    for (var i = 0; i < post.reviews.length; i++) {
      newpost.reviews[i]["votes"] = {
        5: 0,
        "-2": 0,
        "-1": 0,
        0: 0,
        1: 0,
        2: 0,
      };
      for (var j = 0; j < votes.length; j++) {
        if (votes[j].review.toString() == post.reviews[i]._id.toString()) {
          newpost.reviews[i]["votes"][votes[j].points]++;
          if (req.session.uid && votes[j].user.toString() == req.session.uid) {
            newpost.uservotes[votes[j].points].push(
              newpost.reviews[i]._id.toString()
            );
          }
        }
      }
    }
    newpost.recommended = await postController.getRecommendedPosts(newpost);
    return res.send(newpost);
  } else {
    return res.sendStatus(404);
  }
};
exports.convert = async (req, res, next) => {
  const data = await Review.find({ content: { $type: 2 } }).exec();
  for (var i = 0; i < data.length; i++) {
    let rev = data[i];
    let newarr = [];
    if (Array.isArray(rev.coordinates) && rev.coordinates.length > 3) {
      newarr.push([rev.coordinates]);
    }
    newarr.push(rev.content);
    let coordinates =
      Array.isArray(rev.coordinates) && rev.coordinates.length > 3
        ? [rev.coordinates]
        : [];
    await data[i].update({ content: newarr, coordinates: coordinates });
  }
};
exports.getById = async (req, res, next) => {
  try {
    const data = await Review.findById(req.params.id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "comment",
          model: "Comment",
          populate: {
            path: "user",
            model: "User",
          },
        },
      })
      .exec();
    return res.send(data);
  } catch (err) {
    return new Error(err);
  }
};
exports.create = async (req, res, next) => {
  try {
    const post = await Post.findById(req.body.key);
    if (req.session.uid){
      //send push notification
      const user = await User.findById(req.session.uid).select("+balance");
      const receiver = await User.findById(post.user).select("+tokens");
      const senderName = user.username;
      const receiverDevices = receiver.tokens;
      const title = "SnipCritics";
      const body = `${senderName} Gave you feedback`;
      notificationsController.sendPushNotification(
        title,
        body,
        receiverDevices
      );
      console.log(222,req.body.content)
      let content = Array.isArray(req.body.content[0])
        ? req.body.content
        : [req.body.content];
      let t=[]
      for(var i = 0; i < content.length; i++){
        if(content[i].length > 0){
          t.push(content[i])
        }
      }
      content = t
      const revob = {
        content: content,
        coordinates: req.body.coordinates,
        post: req.body.key,
        user:req.session.uid
      };
      const rev = new Review(revob);
      const createdRev = await rev.save();
      let interests = [...post.tags];
      interests.push(post.user._id);
      await Interest.create({
        weight: 1,
        user: req.session.uid,
        topics: interests,
      });
      let w=1
      let time = new Date();
      time = time.getTime() * 1000;
      let startDate = new Date(2021, 11, 1);
      startDate=startDate.getTime()
      let existing_interestScores = await InterestScore.find({user:req.session.uid,interest: {$in:interests}}).exec()
      let interestScoreIds = existing_interestScores.map((interest) => interest._id.toString());
      let interestIds = existing_interestScores.map((interest) => interest.interest.toString());
      for(var i=0;i<interests.length;i++){
        interests[i]=interests[i].toString()
      }
      let outersection=new Set(interests);

      for(let i=0;i<interestIds.length;i++){
        outersection.delete(interestIds[i]);
      }
      outersection=Array.from(outersection);
      let toinsert=[];
      for(var i=0; i<outersection.length; i++){
          toinsert.push({interest:outersection[i],score:parseFloat(
            (parseInt(time / startDate) / 1000)*w
          ),user:req.session.uid})
      }
      if(toinsert.length>0)
      await InterestScore.insertMany(toinsert);
      await InterestScore.updateMany({
        _id: {$in:interestScoreIds},
      },{$inc:{score:parseFloat(
        (parseInt(time / startDate) / 1000)*w
      )}}).exec();
      if (!post) {
        throw new Error("Post Key Is Invalid");
      }
      if (!post.reviews) {
        post.reviews = [createdRev._id];
      } else {
        post.reviews.push(createdRev._id);
      }
      await post.save();
      let rewards=await Reward.findOne({user:user._id,type:"review",progress:{$nin:post._id}}).exec()
      if(rewards){
        req.rewards=await progress(user,rewards,post._id)
      }
      let dr = null;
      if (!user.reviews) {
        user.reviews = [createdRev._id];
      } else {
        user.reviews.push(createdRev._id);
      }
      const additional = {
        content: post.content,
        coordinates: req.body.coordinates,
        type: post.type,
        post_id: post._id,
      };
      if (req.body.dr) {
        dr = await Direct_request.findOne({
          to: req.session.uid,
          from: post.user._id,
          post: req.body.key,
          done: false,
        }).exec();
        if (dr) {
          await Direct_request.updateOne(
            {
              to: req.session.uid,
              from: post.user._id,
              post: req.body.key,
              done: false,
            },
            { done: true }
          ).exec();
          const ids = [];
          let count = parseFloat(dr.cost);
          await Notification.create({
            receiver: post.user._id,
            action: "request",
            target_type: "review",
            target: createdRev._id,
            sender: req.session.uid,
            additional: additional,
          });
          user.balance += parseFloat(count);
          user.requestCount--;
        }
      }
      await user.save();
      let tob={
        tracked: post._id,tracker:{$ne:req.session.uid}
      }
      const trackers = await Tracker.find(tob).exec();
      let tarr=[]
      for (var i = 0; i < trackers.length; i++) {
        let tt =
          "review" +
          (trackers[i].tracker.toString() != post.user.toString()
            ? "_other"
            : "");
        tarr.push({
          receiver: trackers[i].tracker,
          action: "review",
          target_type: tt,
          target: createdRev._id,
          sender: req.session.uid,
          additional: additional,
        })
        if (post.user.toString() == trackers[i].tracker.toString()) {
          let date = new Date();
          date = new Date(date.getTime() + 10 * 60 * 1000);
          let mtracker = trackers[i].tracker;
          const job = schedule.scheduleJob(date, async () => {
            const n = await Notification.find({
              receiver: mtracker,
              action: "review",
              target_type: tt,
              target: createdRev._id,
              sender: req.session.uid,
            }).exec();
            if (n && !n.viewed) {
              const muser = await User.findById(mtracker)
              .select("+email")
              .exec();
              const fr = await Review.findById(createdRev._id)
              .populate("post")
              .exec();
              sendinblue(
                muser.email,
                muser.username,
                6,
                createdRev._id.toString(),
                fr.post.description
              );
            }
          });
        }
      }
      await Notification.insertMany(tarr);
      await Tracker.create({
        tracked: createdRev._id,
        tracked_type: "review",
        tracker: user,
      });
      const newestRev = JSON.parse(JSON.stringify(createdRev));
      newestRev.votes = { 5: 0, 2: 0, 1: 0, 0: 0, "-1": 0, "-2": 0 };
      if (req.body.dr && dr != undefined && dr) newestRev.dr = true;
      newestRev.user=user
      req.data = newestRev;
      req.postByUser = post.user ? post.user : null;
      next();
      return;
      // return res.json(createdRev);
    } else {
      return res.json({ error: 407 });
    }
  } catch (e) {
    next(e);
  }
};

exports.getAll = (req, res, next) => {
  Review.find({}, (error, subscribers) => {
    if (error) next(error);
    req.data = subscribers;
    next();
  });
};

exports.deleteManyReviews = async (reviews, uid) => {
  reviews.forEach((review) => {
    if (review.user == uid) deletePost(review, uid);
  });
};
