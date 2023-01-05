const { uploadFile, deleteFile, getFileStream } = require('../wasabi');
const mongoose = require('mongoose');
const User = require('../models/user');
const Note = require('../models/note');
const Question = require('../models/question');
const { createOrder, captureOrder } = require('../utils/paypal');
const Purchase = require('../models/purchase');
const { sendEventToClient } = require('../utils/eventsHandler');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

exports.deleteOldPost = async (req, res, next) => {
  try {
    Post.find({
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }).exec((error, posts) => {
      posts.map((post) => {
        if (post.type == 'image') deleteFile(post.content);
      });
      posts.remove();
    });
  } catch (err) {}
};

exports.getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const question = await Question.findById(id).populate({
      path: 'sender',
      model: 'User',
    }).populate({
      path: 'notes',
      model: 'Note',
      populate: {
        path: "user",
        model: "User",
      }
      });
      if(!question){
        return res.status(404).json({
          status: "fail",
          message: "Question not found",
        });
      }else if(question.receiver.toString()!==req.user._id.toString()&&question.sender.toString()!==req.user._id.toString()){
        return res.status(401).json({
          status: "fail",
          message: "Unauthorized",
        });
      }else{
        if(question.status.action==='pending'&&question.receiver.toString()==req.user._id.toString()){
          console.log('here');
          question.status.action='accepted';
          question.markModified('status');
          await question.save();
        }
        return res.send(question);
      }
  } catch (error) {
    console.log(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { description, receiver } = req.body;
    let question = new Question({
      description,
      receiver,
      sender: req.user._id,
    });
    await question.save();

    question = await Question.findById(question._id).populate({
      path: 'sender',
      model: 'User',
    });

    console.log(question);
    sendEventToClient(receiver, question);
    return res.send(question);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  let userId = req.user._id;
  try {
    const questions = await Question.find({
      $or: [{ sender: userId}, { receiver: userId}],
    })
    .populate({
      path: 'sender',
      model: 'User',
      populate: [
        {
          path: 'experience',
          populate: { path: 'company', model: 'Company' },
        },
        {
          path: 'education',
          populate: { path: 'university', model: 'University' },
        },
        {
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
        },
      ],
    })
    .populate({
      path: 'receiver',
      model: 'User',
      populate: [
        {
          path: 'experience',
          populate: { path: 'company', model: 'Company' },
        },
        {
          path: 'education',
          populate: { path: 'university', model: 'University' },
        },
        {
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
        },
      ],
    })
      .exec();

    const sent = questions.filter(
      (q) => q.sender._id.toString() === req.user._id.toString()
    );
    const received = questions.filter(
      (q) => q.receiver._id.toString() === req.user._id.toString()
    );

   return  res.send({ sent, received });
  } catch (err) {
    next(err);
    return [];
  }
};

exports.pay = async (req, res, next) => {
  const { cost, capture } = req.body;

  if (!capture) {
    const order = await createOrder(cost, 'Papayask');
    await Purchase.create({
      user: req.user._id,
      cost,
      transactionId: order.result.id,
      purchased: 'question',
    });
    return res.send(order);
  }

  const order = await captureOrder(capture);
  if (order.result.id) {
    return res.send(order);
  }
};

exports.updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { action, reason } = req.body;
  try {
    const question = await Question.findById(id).populate({
      path: 'sender',
      model: 'User',
    });

    question.status.action = action;
    question.status.reason = reason;
    if (action === 'rejected') {
      question.status.done = true;
    }
    await question.save();
    res.send(question);
  } catch (err) {
    next(err);
  }
};

exports.getBySearch = async (req, res, next) => {
  let ob = { hidden: { $ne: true }, user: { $exists: true } };
  let skip = 0;
  const { fuzzy } = req.body;
  let prevent = req.body.ids || [];
  prevent = prevent.map((id) => mongoose.Types.ObjectId(id));
  req.session.feedTime = new Date();
  const regex = fuzzy
    ? new RegExp(escapeRegex(req.params.search), 'gi')
    : req.params.search;
  if (!!req.params.tag) {
    if (req.params.tag !== 'all') {
      const tag = await Tag.findOne({ name: req.params.tag }).exec();
      if (tag) {
        ob['tags'] = { $elemMatch: { $eq: mongoose.Types.ObjectId(tag._id) } };
      }
    }
  }
  let SearchByTag = [];
  const tagSearch = await Tag.aggregate([
    {
      $match: {
        name: fuzzy ? regex : { $regex: req.params.search, $options: 'i,m' },
      },
    },
    {
      $lookup: {
        from: 'posts',
        let: { tagId: '$_id' },
        pipeline: [
          {
            $match: {
              $and: [
                {
                  $expr: {
                    $in: ['$$tagId', '$tags'],
                  },
                },
                { _id: { $nin: prevent } },
              ],
            },
          },
        ],
        as: 'posts',
      },
    },
  ]);
  const tagsS = [];
  if (tagSearch) {
    let mySum = 0;
    SearchByTag = tagSearch.map((tg) => {
      const pt = tg.posts;
      pt.forEach((p) => {
        mySum += p.reviews.length;
      });
      tagsS.push({ ...tg._doc, len: pt.length, tagSum: mySum });
      return tg._id;
    });
  }
  let SearchByUser = [];
  const userS = [];
  const userSearch = await User.find({
    $or: [
      {
        username: fuzzy
          ? regex
          : { $regex: req.params.search, $options: 'i,m' },
      },
      { expertise: { $in: SearchByTag } },
    ],
  });
  if (userSearch) {
    // ob["tags"] = { $elemMatch: { $eq: mongoose.Types.ObjectId(tag._id) } };
    // console.log(userSearch);
    SearchByUser = userSearch.map((us) => us._id);
  }
  // BY default we sort it by updatedAt value in descending
  let s = [{ $sort: { updatedAt: -1 } }];

  // AND if we have order param has some value we are changing our query according to it.
  // if (req.params.order) {
  //   if (req.params.order == "new")
  //     // if the order value is new. then just sort it according to createdAt in descending .
  //     s = [
  //       {
  //         $sort: { createdAt: -1 },
  //       },
  //     ];
  //   else if (req.params.order == "active") {
  //     // if the order value is active. then just sort it according to updatedAt in descending .
  //     s = [{ $sort: { updatedAt: -1 } }];
  //   } else if (req.params.order == "reviews") {
  //     // if the order value is reviews. then just sort it according to the length of review counts in descending .
  //     // 1) reviewsLength has count of total no of reviews
  //     // 2) than just sort it by the counted reviewsLength in descending order
  //     s = [
  //       {
  //         $addFields: {
  //           reviewsLength: {
  //             $size: "$reviews",
  //           },
  //         },
  //       },
  //       {
  //         $sort: {
  //           reviewsLength: -1,
  //         },
  //       },
  //     ];
  //   } else if (req.params.order == "comments") {
  //     // if the order value is comments. then just sort it according to the length of comment counts in descending .
  //     // 1) commentsLength has count of total no of comments
  //     // 2) than just sort it by the counted commentsLength in descending order
  //     s = [
  //       {
  //         $addFields: {
  //           commentsLength: {
  //             $size: "$comments",
  //           },
  //         },
  //       },
  //       {
  //         $sort: {
  //           commentsLength: -1,
  //         },
  //       },
  //     ];
  //   } else {
  //     s = [];
  //   }
  // }
  Post.aggregate([
    {
      $match: {
        $and: [
          // Making and relation b/w search query and the tag filter.
          {
            $or: [
              // Making an or relation b/w Matching search query with content or description.

              {
                description: fuzzy
                  ? regex
                  : {
                      $regex: req.params.search,
                    },
              },
              {
                tags: {
                  $in: SearchByTag,
                },
              },
              {
                user: {
                  $in: SearchByUser,
                },
              },
            ],
          },
          ob,
        ],
      },
    },
    {
      $lookup: {
        from: 'reviews',
        let: { reviewIds: '$reviews' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$reviewIds'],
              },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $project: {
              'user.password': 0,
              'user.updatedAt': 0,
              'user.email': 0,
              'user.createddAt': 0,
              'user.confirmed': 0,
              'user.postsAllowed': 0,
              'user.reviewsToPost': 0,
            },
          },
        ],
        as: 'reviews',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        'user.password': 0,
        'user.updatedAt': 0,
        'user.email': 0,
        'user.createdAt': 0,
        'user.confirmed': 0,
        'user.postsAllowed': 0,
        'user.reviewsToPost': 0,
      },
    },
    {
      $lookup: {
        from: 'tags',
        localField: 'tags',
        foreignField: '_id',
        as: 'tags',
      },
    },
    ...s, //Destructuring sort object to aggregate function
  ])
    .skip(fuzzy ? 0 : skip * 12)
    .limit(fuzzy ? 10 : 12)
    .exec((error, posts) => {
      if (error) next(error);
      // console.log("search d:", d);
      req.data = { posts, user: userSearch, tag: tagsS };
      return next();
    });
};
exports.finish=async(req,res,next)=>{
  const {questionId}=req.body;
  const question=await Question.findById(questionId);
  if(!question){
    return res.status(404).json({
      status: "fail",
      message: "Question not found",
    });
  }else{
    const notes=await Note.find({question:question._id, user:question.receiver});
    if(notes.length>0){
      question.status.done=true;
      question.markModified('status');
      await question.save();
      return res.send("done");
    }else{
      return res.status(400);
    }
  }
}
exports.deleteAll = (req, res, next) => {
  Post.deleteMany()
    .then(() => {
      req.data = 'gone';
      next();
    })
    .catch((e) => {
      next(e.message);
      return [];
    });
};
