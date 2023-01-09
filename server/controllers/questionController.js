const Note = require('../models/note');
const User = require('../models/user');
const Question = require('../models/question');
const Purchase = require('../models/purchase');
const notificationsController = require('./notificationsController');
const { createOrder, captureOrder } = require('../utils/paypal');
const { sendEventToClient } = require('../utils/eventsHandler');

exports.getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const question = await Question.findById(id)
      .populate({
        path: 'sender',
        model: 'User',
      })
      .populate({
        path: 'notes',
        model: 'Note',
        populate: {
          path: 'user',
          model: 'User',
        },
      });
    if (!question) {
      return res.status(404).json({
        status: 'fail',
        message: 'Question not found',
      });
    } else if (
      question.receiver.toString() !== req.user._id.toString() &&
      question.sender.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized',
      });
    } else {
      return res.send(question);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { description, receiver } = req.body;
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'Receiver not found',
      });
    }
    let endAnswerTime = new Date();
    endAnswerTime.setDate(
      endAnswerTime.getDate() + receiverUser.request_settings.time_limit.days
    );
    endAnswerTime.setHours(
      endAnswerTime.getHours() + receiverUser.request_settings.time_limit.hours
    );
    let question = new Question({
      description,
      receiver,
      sender: req.user._id,
      endAnswerTime,
    });
    await question.save();

    question = await Question.findById(question._id).populate({
      path: 'sender',
      model: 'User',
    });

    sendEventToClient(receiver, question, 'question');
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
      $or: [{ sender: userId }, { receiver: userId }],
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
      .populate({
        path: 'notes',
        model: 'Note',
        populate: {
          path: 'user',
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
        },
      })
      .exec();

    const sent = questions.filter(
      (q) => q.sender._id.toString() === req.user._id.toString()
    );
    const received = questions.filter(
      (q) => q.receiver._id.toString() === req.user._id.toString()
    );

    return res.send({ sent, received });
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
      const user = await User.findById(question.receiver);
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found',
        });
      }
      const notification = {
        receiver: question.sender,
        sender: question.receiver,
        title: 'Question rejected',
        body: `Your question to ${user.name} has been rejected`,
        question: question._id,
      };
      await notificationsController.create(notification);

      sendEventToClient(question.receiver, notification, 'notification');
    }
    await question.save();
    res.send(question);
  } catch (err) {
    next(err);
  }
};

exports.finish = async (req, res, next) => {
  const { questionId } = req.body;
  const question = await Question.findById(questionId);
  if (!question) {
    return res.status(404).json({
      status: 'fail',
      message: 'Question not found',
    });
  } else {
    const notes = await Note.find({
      question: question._id,
      user: question.receiver,
    });
    if (notes.length > 0) {
      question.status.done = true;
      question.markModified('status');
      await question.save();

      const user = await User.findById(question.receiver);
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found',
        });
      }
      const notification = {
        receiver: question.sender,
        sender: question.receiver,
        title: 'Question answered',
        body: `Your question to ${user.name} has been answered`,
        question: question._id,
      };

      await notificationsController.create(notification);

      sendEventToClient(question.receiver, notification, 'notification');
      return res.send('done');
    } else {
      return res
        .status(400)
        .json({ error: 'You have to add at least one note' });
    }
  }
};
