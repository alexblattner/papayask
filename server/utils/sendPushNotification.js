const admin = require('firebase-admin');

exports.sendPushNotification = async (tokens, data, type) => {
  const { question, senderName } = data;
  let body = '';
  let title = '';
  switch (type) {
    case 'question':
      body = `${senderName} has asked you a question`;
      title = 'New Question';
      break;
    case 'answer':
      body = `${senderName} has answered your question`;
      title = 'New Answer';
      break;
    case 'reject':
      body = `${senderName} has rejected your question`;
      title = 'Question Rejected';
    default:
      break;
  }

  try {
    const response = await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      data: {
        question: question._id.toString(),
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
