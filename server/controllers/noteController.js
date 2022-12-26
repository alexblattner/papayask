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
exports.edit = async (req, res, next) => {
  const note = await Note.findById(req.body.id).exec();
  if (note && note.user.toString() == req.user._id.toString()) {
    await note.update({ content: req.body.content });
    return res.send(note);
  } else {
    return res.sendStatus(403);
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndRemove(req.body.id);
    rea.status(204);
  } catch (e) {
    console.log(e.message);
  }
};

exports.create = async (req, res, next) => {
  const question = await Question.findById(req.body.questionId).exec();
  if (question && question.receiver.toString() == req.user._id.toString()) {
    let content = Array.isArray(req.body.content)
      ? req.body.content[0]
      : req.body.content;
    let submission = {
      user: req.user._id,
      question: req.body.questionId,
      content: content,
    };
    if (req.body.coordinates) submission.coordinates = req.body.coordinates;
    await Note.create(submission).then(async (data) => {
      if (
        !question.status ||
        !question.status.action ||
        question.status.action == "pending"
      ) {
        if (question.status) {
          question.status.action = "answered";
        } else {
          question.status = { action: "accepted", done: false, reason: "" };
        }
      }
      question.notes.push(data._id);
      await question.save();
      return res.send(data);
    });
  } else {
    return res.sendStatus(403);
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
