const mongoose = require('mongoose');
const Notification = require('../models/notification');

exports.create = async (notificationData) => {
  const { receiver, sender, title, body, question } = notificationData;
  let notification = await Notification.create({
    receiver,
    sender,
    title,
    body,
    question,
  });
  notification = await Notification
    .findById(notification._id)
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
    });

  return notification;
};

exports.getAll = async (req, res, next) => {
  const notifications = await Notification.find({
    receiver: req.user._id.toString(),
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
      path: 'question',
      model: 'Question',
      populate: [
        {
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
        },
        {
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
        },
        {
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
        },
      ],
    });
  res.send(notifications);
};

exports.readNotifications = async (req, res, next) => {
  const notificationsIds = req.body.notifications.map((n) =>
    mongoose.Types.ObjectId(n)
  );

  try {
    const result = await Notification.updateMany(
      { _id: { $in: notificationsIds } },
      { $set: { isRead: true } }
    );
    res.json({ message: 'Notifications read' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
