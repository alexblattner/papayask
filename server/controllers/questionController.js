const { uploadFile, deleteFile, getFileStream } = require('../wasabi');
const mongoose = require('mongoose');
const User = require('../models/user');
const Note = require('../models/note');
const { login } = require('./userController');
const Question = require('../models/question');
const { createOrder, captureOrder } = require('../utils/paypal');
const Purchase = require('../models/purchase');

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
    });

    res.send(question);
  } catch (error) {
    console.log(error);
  }
};

exports.create = async (req, res, next) => {
  console.log(req.body);
  try {
    const { description, receiver } = req.body;
    const question = new Question({
      description,
      receiver,
      sender: req.user._id,
    });
    await question.save();
    res.send(question);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    //find all questions where the user is the sender or receiver and populate the sender and receiver fields and return object with sent and received questions
    const questions = await Question.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate({
        path: 'sender',
        model: 'User',
      })
      .populate({
        path: 'receiver',
        model: 'User',
      })
      .exec();

    const sent = questions.filter(
      (q) => q.sender._id.toString() === req.user._id.toString()
    );
    const received = questions.filter(
      (q) => q.receiver._id.toString() === req.user._id.toString()
    );

    res.send({ sent, received });
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
exports.getPosts = async (req, res, next) => {
  //calculate post score by summing up the interest score of each post
  let expr =
    req.session && req.session.uid
      ? {
          $expr: {
            $and: [
              {
                $eq: [{ $toObjectId: req.session.uid.toString() }, '$user'],
              },
              {
                $or: [
                  {
                    $eq: ['$interest', '$$user'],
                  },
                  { $in: ['$interest', '$$tags'] },
                  { $eq: ['$interest', '$$post'] },
                ],
              },
            ],
          },
        }
      : {
          $expr: {
            $or: [
              {
                $eq: ['$interest', '$$user'],
              },
              { $in: ['$interest', '$$tags'] },
            ],
          },
        };
  let used_posts =
    req.body.ids != undefined && Array.isArray(req.body.ids)
      ? req.body.ids
      : [];
  for (var i = 0; i < used_posts.length; i++) {
    used_posts[i] = mongoose.Types.ObjectId(used_posts[i]);
  }
  //let test=await Post.find({_id:{$nin:used_posts}}).limit(12)
  let match = {
    $and: [
      { user: { $ne: null } },
      { user: { $ne: mongoose.Types.ObjectId(req.session.uid) } },
      { _id: { $nin: used_posts } },
    ],
  };
  if (req.params.tag) {
    var catname = req.params.tag
      .replace('_', ' ')
      .replace('_', ' ')
      .replace('_', ' ');
    const tag = await Tag.findOne({ name: catname }).exec();
    if (tag) {
      const children = await Tag.find({
        parent: { $elemMatch: { $eq: mongoose.Types.ObjectId(tag._id) } },
      }).exec();
      if (children.length > 0) {
        let finaltags = [tag._id];
        for (let i = 0; i < children.length; i++) {
          finaltags.push(children[i]._id);
        }
        match['$and'].push({ tags: { $in: finaltags } });
      } else {
        match['$and'].push({
          tags: { $elemMatch: { $eq: mongoose.Types.ObjectId(tag._id) } },
        });
      }
    }
  }
  let startDate = new Date(2021, 11, 1);
  startDate = startDate.getTime() * 10;
  /*let reviews = await Review.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "posts",
        localField: "post",
        foreignField: "_id",
        as: "post",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              "user.password": 0,
              "user.updatedAt": 0,
              "user.email": 0,
              "user.createddAt": 0,
              "user.confirmed": 0,
              "user.postsAllowed": 0,
              "user.reviewsToPost": 0,
              "user.reviews": 0,
              "user.comments": 0,
              "user.posts": 0,
              "user.links": 0,
              "user.tokens": 0,
              "user.request_settings": 0,
              "user.description": 0,
              "user.balance": 0,
              "user.lastLogIn": 0,
              "user.createdAt": 0,
              "user.requestCount": 0,
              "user.isSetUp": 0,
              "user.comments": 0,
              "user.reviews": 0,
              "user.votes": 0,
            },
          },
        ],
      },
    },
    {
      $unwind: "$post",
    },
    {
      $project: {
        "post.language": 0,
        "post.reviews": 0,
        "post.comments": 0,
        "post.createdAt": 0,
        "post.updatedAt": 0,
      },
    },
    {
      $lookup: {
        from: "tags",
        let: { tagIds: "$post.tags" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$tagIds"],
              },
            },
          },
        ],
        as: "tags",
      },
    },
    /*{
      //join interestScore collection with post
      $lookup: {
        from: "interestscores",
        let: { tags: "$tags", user: "$user" },
        pipeline: [
          {
            $match: expr,
          },
        ],
        as: "interests",
      },
    },
    {
      $addFields: {
        score: {
          $multiply: [
            {
              $sum: [{ $sum: "$interests.score" }, 1],
            },
            {
              $divide: [
                { $multiply: [{ $toLong: "$updatedAt" }, 1] },
                startDate,
              ],
            },
          ],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        "user.password": 0,
        "user.updatedAt": 0,
        "user.email": 0,
        "user.createddAt": 0,
        "user.confirmed": 0,
        "user.postsAllowed": 0,
        "user.reviewsToPost": 0,
        "user.reviews": 0,
        "user.comments": 0,
        "user.posts": 0,
        "user.links": 0,
        "user.tokens": 0,
        "user.request_settings": 0,
        "user.description": 0,
        "user.balance": 0,
        "user.lastLogIn": 0,
        "user.createdAt": 0,
        "user.requestCount": 0,
        "user.isSetUp": 0,
        "user.comments": 0,
        "user.reviews": 0,
        "user.votes": 0,
      },
    },
    {
      $lookup: {
        from: "comments",
        let: { commentIds: "$comments" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$commentIds"],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
          {
            $project: {
              "user.password": 0,
              "user.updatedAt": 0,
              "user.email": 0,
              "user.createddAt": 0,
              "user.confirmed": 0,
              "user.postsAllowed": 0,
              "user.reviewsToPost": 0,
              "user.reviews": 0,
              "user.comments": 0,
              "user.posts": 0,
              "user.links": 0,
              "user.tokens": 0,
              "user.request_settings": 0,
              "user.description": 0,
              "user.balance": 0,
              "user.lastLogIn": 0,
              "user.createdAt": 0,
              "user.requestCount": 0,
              "user.isSetUp": 0,
              "user.comments": 0,
              "user.reviews": 0,
              "user.votes": 0,
            },
          },
        ],
        as: "comments",
      },
    },
    {
      //join interestScore collection with post
      $lookup: {
        from: "votes",
        let: { revId: "$_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$review", "$$revId"] } },
          },
        ],
        as: "votes",
      },
    },
    { $project: { "votes.post": 0, "votes.tags": 0, "votes.receiver": 0 } },
    {$sort:{
      createdAt:-1
    }}
  ]).limit(12);*/
  let start = new Date(2021, 11, 1);
  let s = {
    $cond: [
      { $gt: [{ $size: '$interests' }, 0] },
      { $divide: [{ $sum: '$interests.score' }, { $size: '$interests' }] },
      0,
    ],
  };
  let seconds = { $sum: [{ $toLong: '$updatedAt' }, start.getTime()] };
  let order = { $log10: { $max: [seconds, 1] } };
  let sign = {
    $cond: [{ $gt: [s, 0] }, 1, { $cond: [{ $lt: [s, 0] }, -1, 0] }],
  };
  let signedOrder = { $multiply: [sign, order] };
  let score = { $sum: [signedOrder, { $divide: [seconds, 10000000] }] };
  let posts = await Post.aggregate([
    {
      $match: match,
    },
    {
      //join interestScore collection with post
      $lookup: {
        from: 'interestscores',
        let: { tags: '$tags', user: '$user', post: '$_id' },
        pipeline: [
          {
            $match: expr,
          },
        ],
        as: 'interests',
      },
    },
    //{$match:{$expr:{$gt:[{$size:"$interests"},0]}}},
    {
      $addFields: {
        score: score,
      },
    },
    {
      $sort: {
        score: -1,
      },
    },
    { $limit: 12 },
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
      $addFields: {
        tags: {
          $map: {
            input: '$tags',
            in: { $toObjectId: '$$this' },
          },
        },
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
              'user.reviews': 0,
              'user.comments': 0,
              'user.posts': 0,
              'user.links': 0,
              'user.tokens': 0,
              'user.request_settings': 0,
              'user.description': 0,
              'user.balance': 0,
              'user.lastLogIn': 0,
              'user.createdAt': 0,
              'user.requestCount': 0,
              'user.isSetUp': 0,
              'user.comments': 0,
              'user.reviews': 0,
              'user.votes': 0,
            },
          },
          {
            //join interestScore collection with post
            $lookup: {
              from: 'votes',
              let: { revId: '$_id' },
              pipeline: [
                {
                  $match: { $expr: { $eq: ['$review', '$$revId'] } },
                },
              ],
              as: 'votes',
            },
          },
          {
            $project: { 'votes.post': 0, 'votes.tags': 0, 'votes.receiver': 0 },
          },
        ],
        as: 'reviews',
      },
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
        'user.reviews': 0,
        'user.comments': 0,
        'user.posts': 0,
        'user.links': 0,
        'user.tokens': 0,
        'user.request_settings': 0,
        'user.description': 0,
        'user.balance': 0,
        'user.lastLogIn': 0,
        'user.createdAt': 0,
        'user.requestCount': 0,
        'user.isSetUp': 0,
        'user.comments': 0,
        'user.reviews': 0,
        'user.votes': 0,
      },
    },
  ]).limit(12);

  let postList = JSON.parse(JSON.stringify(posts));
  //let revList = JSON.parse(JSON.stringify(reviews));

  // revList.forEach((element, i) => console.log("revList", element._id));
  // revList1.forEach((element) => console.log("revList1", element._id));
  for (let postIndex = 0; postIndex < postList.length; postIndex++) {
    // let votes = await Vote.find({ post: postList[postIndex]._id }).exec();
    postList[postIndex].uservotes = {
      5: [],
      '-2': [],
      '-1': [],
      0: [],
      1: [],
      2: [],
    };
    for (let i = 0; i < postList[postIndex].reviews.length; i++) {
      let finalvotes = {
        5: 0,
        '-2': 0,
        '-1': 0,
        0: 0,
        1: 0,
        2: 0,
      };
      const currentvotes = postList[postIndex].reviews[i].votes;
      for (var j = 0; j < currentvotes.length; j++) {
        if (
          currentvotes[j].review.toString() ==
          postList[postIndex].reviews[i]._id.toString()
        ) {
          finalvotes[currentvotes[j].points]++;
          if (
            req.session.uid &&
            currentvotes[j].user.toString() == req.session.uid
          ) {
            postList[postIndex].uservotes[currentvotes[j].points].push(
              postList[postIndex].reviews[i]._id.toString()
            );
          }
        }
      }
      postList[postIndex].reviews[i].votes = finalvotes;
    }
  }
  /*for (let revIndex = 0; revIndex < revList.length; revIndex++) {
    // let votes = await Vote.find({ post: postList[postIndex]._id }).exec();
    revList[revIndex].uservotes = {
      5: [],
      "-2": [],
      "-1": [],
      0: [],
      1: [],
      2: [],
    };
    const voteCounts = {
      5: 0,
      "-2": 0,
      "-1": 0,
      0: 0,
      1: 0,
      2: 0,
    };
    const votes = revList[revIndex].votes;
    for (var j = 0; j < votes.length; j++) {
      if (votes[j].review.toString() == revList[revIndex]._id.toString()) {
        voteCounts[votes[j].points]++;
        if (req.session.uid && votes[j].user.toString() == req.session.uid) {
          revList[revIndex].uservotes[votes[j].points].push(
            revList[revIndex]._id.toString()
          );
        }
      }
    }
    revList[revIndex]["votes"] = voteCounts;
  }
  let farr = [];
  while (farr.length < 12&&!(revList.length==0&&postList.length==0)) {
    // console.log("post------", postList[0], "review------", revList[0]);
    if(revList.length==0){
      farr.push(postList[0]);
    }else if(postList.length==0){
      farr.push(revList[0]);
    }else if (postList[0].score > revList[0].score) {
      farr.push(postList[0]);
      postList.shift();
    } else {
      farr.push(revList[0]);
      revList.shift();
    }
  }
  console.log("f",farr.length);*/
  // console.log("orginazedData", orginazedData[0]);
  // console.log("postData", postList[1]);
  if (req.session && req.session.uid && postList.length > 0) {
    let postIds = postList.map((post) => post._id.toString());
    let w = -2000;
    let time = new Date();
    time = time.getTime() * 1000;
    let startDate = new Date(2021, 11, 1);
    startDate = startDate.getTime();
    await Interest.create({
      topics: postIds,
      user: req.session.uid,
      weight: w,
    });
    let existing_interestScores = await InterestScore.find({
      user: req.session.uid,
      interest: { $in: postIds },
    }).exec();
    let interestScoreIds = existing_interestScores.map((interest) =>
      interest._id.toString()
    );
    let interestIds = existing_interestScores.map((interest) =>
      interest.interest.toString()
    );
    let outersection = new Set(postIds);

    for (let i = 0; i < interestIds.length; i++) {
      outersection.delete(interestIds[i]);
    }
    outersection = Array.from(outersection);
    let toinsert = [];
    for (var i = 0; i < outersection.length; i++) {
      toinsert.push({
        interest: outersection[i],
        score: parseFloat((parseInt(time / startDate) / 1000) * w),
        user: req.session.uid,
      });
    }
    if (toinsert.length > 0) await InterestScore.insertMany(toinsert);
    await InterestScore.updateMany(
      {
        _id: { $in: interestScoreIds },
      },
      { $inc: { score: parseFloat((parseInt(time / startDate) / 1000) * w) } }
    ).exec();
  }
  return res.send(postList);
};
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
