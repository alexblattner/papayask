const Note = require('../models/note');
const User = require('../models/user');
const Question = require('../models/question');
const Purchase = require('../models/purchase');
const notificationsController = require('./notificationsController');
const { createOrder, captureOrder } = require('../utils/paypal');
const { sendEventToClient } = require('../utils/eventsHandler');
const { sendPushNotification } = require('../utils/sendPushNotification');

exports.getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        status: 'fail',
        message: 'Question not found',
      });
    } else if (
      question.receiver._id.toString() !== req.user._id.toString() &&
      question.sender._id.toString() !== req.user._id.toString()
    ) {
      console.log('Unauthorized', question.receiver.toString());
      console.log('Unauthorized', req.user._id.toString());
      console.log('Unauthorized', question.sender.toString());
      console.log('Unauthorized', req.user._id.toString());
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized',
      });
    } else {
      console.log('question');
      return res.send(question);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { description, receiver } = req.body;
    const receiverUser = await User.findById(receiver).select('+tokens');
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

    question = await Question.findById(question._id);
    sendEventToClient(receiver, question, 'question');
    sendPushNotification(
      receiverUser.tokens,
      {
        question,
        senderName: req.user.name,
      },
      'question'
    );
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
    });

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
    const question = await Question.findById(id);
    const receiverUser = await User.findById(question.sender).select('+tokens');

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
      sendPushNotification(receiverUser.tokens, {
        question,
        senderName: req.user.name,
      }, 'reject')
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
  const receiverUser = await User.findById(question.sender).select('+tokens');
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
      sendPushNotification(receiverUser.tokens, {
        question,
        senderName: req.user.name,
      }, 'answer')
      return res.send('done');
    } else {
      return res
        .status(400)
        .json({ error: 'You have to add at least one note' });
    }
  }
};
