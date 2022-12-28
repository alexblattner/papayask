const admin = require("./config");
const User = require("../models/user");

class Middleware {
  async decodeToken(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
      // console.log("token", token);
      const decoded = await admin.auth().verifyIdToken(token);
      // console.log(decoded);
      const { uid } = decoded;

      let user = await User.findOne({ uid });
      // console.log(user);
      // if (!user) {
      //   user = awiat User.create(decoded);
      //   // return res.status(401).json({ error: "Unauthorized" });
      // }
      req.user = user;
      if (decoded) {
        if (req.body) {
          req.body.auth_time = decoded.auth_time;
        }
        return next();
      }
      return res.status(401).send("Unauthorized");
    } catch (err) {
      console.log("my error", err);
      return res.status(500).send("Internal Server Error");
    }
  }
}
module.exports = new Middleware();
