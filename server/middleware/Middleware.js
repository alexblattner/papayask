const admin = require('./config');
const User = require('../models/user');

class Middleware {
  async decodeToken(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = await admin.auth().verifyIdToken(token);
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
      return res.status(500).send({ error: err.message });
    }
  }
}
module.exports = new Middleware();
