const admin = require('./config');
const User = require('../models/user');

class Middleware {
  async decodeToken(req, res, next) {
    if (!req.headers.authorization) {
      const sessionCookie = req.cookies.__session;
      if (!sessionCookie) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      token = req.cookies.__session;
    }
    try {
      let decoded;
      if (req.cookies.__session) {
        decoded = await admin.auth().verifySessionCookie(token, true);
      } else {
        decoded = await admin.auth().verifyIdToken(token);
      }
      const { uid } = decoded;
      let user = await User.findOne({ uid });
      req.user = user;
      if (decoded) {
        if (req.body) {
          req.body.auth_time = decoded.auth_time;
        }

        return next();
      }
      return res.status(401).send('Unauthorized');
    } catch (err) {
      console.log(err);
      return res.status(500).send('Internal Server Error');
    }
  }
  async getUser(req, res, next) {
    if (!req.headers.authorization) {
      const sessionCookie = req.cookies.__session;
      if (!sessionCookie) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      token = req.cookies.__session;
    }
    try {
      let decoded;
      if (req.cookies.__session) {
        decoded = await admin.auth().verifySessionCookie(token, true);
      } else {
        decoded = await admin.auth().verifyIdToken(token);
      }
      const { uid } = decoded;
      let user = await User.findOne({ uid });
      return res.send(user);
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  }
}
module.exports = new Middleware();
