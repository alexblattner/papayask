const admin = require('./config');
const User = require('../models/user');

class Middleware {
  async decodeToken(req, res, next) {
    if (!req.headers.authorization) {
      console.log('No authorization header');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      const { uid } = decoded;
      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = user;
      if (decoded) {
        if (req.body) {
          req.body.auth_time = decoded.auth_time;
        }
        return next();
      }
      return res.status(401).send('Unauthorized');
    } catch (err) {
      return res.status(400).send('Internal Server Error');
    }
  }
}
module.exports = new Middleware();
