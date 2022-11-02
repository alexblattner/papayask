require("dotenv/config");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");
const questionController = require("./controllers/questionController");
const reviewController = require("./controllers/noteController");
const userController = require("./controllers/userController");
const schedule = require("node-schedule");
const middleware = require('./firebase/Middleware');

const SessionModel = require("./models/session");
const passport = require("passport"),
  TwitterTokenStrategy = require("passport-twitter-token");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
console.log(
  "mongodb+srv://SnipCritics:" +
    process.env.MONGODB_PASSWORD +
    "@cluster" +
    (process.env.NODE_ENV == "production" ? 0 : 2) +
    ".rfgl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
const {
  uploadFile,
  deleteFile,
  getFileStream,
  getFilesStream,
  copy,
  s3,
} = require("./wasabi");
const origin =
  process.env.NODE_ENV == "development"
    ? ["http://localhost:3000", "http://localhost:58550"]
    : process.env.NODE_ENV == "production"
    ? ["https://www.snipcritics.com", "https://snipcritics.com"]
    : ["https://www.scbackend.com", "https://scbackend.com"];
    app.disable('x-powered-by');

    app.use(function(req, res, next) {
      // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', origin);
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Pass to next layer of middleware
    next();
    });
    
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors({
      origin: origin
    }));
const domain =
  process.env.NODE_ENV == "development"
    ? "localhost:3000"
    : process.env.NODE_ENV == "production"
    ? "snipcritics.com"
    : "scbackend.com";
mongoose.connect(
  "mongodb+srv://SnipCritics:" +
    process.env.MONGODB_PASSWORD +
    "@cluster" +
    (process.env.NODE_ENV == "production" ? 0 : 2) +
    ".3mops8t.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// on the request to root (localhost:3000/)
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});
const Question = require("./models/question");
const Note = require("./models/note");
const User = require("./models/user");
function removeext(str) {
  let noext = "";
  let extarr = str.split(".");
  for (var i = 0; i < extarr.length - 1; i++) {
    noext += extarr[i] + ".";
  }
  noext = noext.slice(0, -1);
  return noext;
}
// SAVE STREAM SESSIONS UID
const streamSessions = {};
exports.streamSessionsList = streamSessions;

app.get("/loggedIn?", userController.loggedIn);

app.get("/username/:username", userController.getByUsername);
app.get("/email/:email", userController.getByEmail);
app.post("/username", userController.changeUsername);
app.post("/login", userController.login);
app.post("/user",middleware.decodeToken, userController.create);
app.get("/user/:idorusername", userController.getByIdOrUsername);
app.get("/question/:pid", questionController.getById);
// app.get('/post/:id/:tag', postController.getById, (req, res, next) => {
//   return res.send(req.data);
// });
app.get("/logout", (req, res, next) => {
  const uid = req.session.uid;
  req.session = null;
  res.end(uid);
});
// app.get('/post/:id/:tag/:order', postController.getById, (req, res, next) => {
//   return res.send(req.data);
// });

app.post("/user", userController.create);
app.post("/user/:userId/register-token", userController.registerToken);
// app.post("/deleteReviews", async (req, res, next) => {
//   if (req.session.uid) {
//     ids = req.body.ids.split("/");
//     const reviews = await Review.find({ _id: { $in: ids } }).exec();
//     await deleteManyReviews(reviews, req.session.uid);
//     return res.sendStatus(200);
//   }
//   return res.sendStatus(407);
// });

// Change the 404 message modifing the middleware
app.use(function (req, res, next) {
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});
const port = process.env.NODE_ENV == "development" ? 5000 : 8080;
// start the server in the port 3000 !
app.listen(port, function () {
  console.log("Example app listening on port " + port + ".");
});
