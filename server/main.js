require('dotenv/config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const questionController = require('./controllers/questionController');
const reviewController = require('./controllers/noteController');
const userController = require('./controllers/userController');
const schedule = require('node-schedule');
const middleware = require('./firebase/Middleware');
const cloudinary = require('./utils/cloudinary');
const SessionModel = require('./models/session');
const passport = require('passport'),
  TwitterTokenStrategy = require('passport-twitter-token');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
console.log(
  'mongodb+srv://SnipCritics:' +
    process.env.MONGODB_PASSWORD +
    '@cluster' +
    (process.env.NODE_ENV == 'production' ? 0 : 2) +
    '.rfgl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
);
const {
  uploadFile,
  deleteFile,
  getFileStream,
  getFilesStream,
  copy,
  s3,
} = require('./wasabi');
const origin =
  process.env.NODE_ENV == 'development'
    ? ['http://localhost:3000', 'http://localhost:58550']
    : process.env.NODE_ENV == 'production'
    ? ['https://www.snipcritics.com', 'https://snipcritics.com']
    : ['https://www.scbackend.com', 'https://scbackend.com'];
app.disable('x-powered-by');

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', origin);

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: origin,
  })
);
const domain =
  process.env.NODE_ENV == 'development'
    ? 'localhost:3000'
    : process.env.NODE_ENV == 'production'
    ? 'snipcritics.com'
    : 'scbackend.com';
mongoose.connect(
  'mongodb+srv://SnipCritics:' +
    process.env.MONGODB_PASSWORD +
    '@cluster' +
    (process.env.NODE_ENV == 'production' ? 0 : 2) +
    '.3mops8t.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// on the request to root (localhost:3000/)
const db = mongoose.connection;
db.once('open', () => {
  console.log('Successfully connected to MongoDB using Mongoose!');
});
const Question = require('./models/question');
const Note = require('./models/note');
const User = require('./models/user');
const University = require('./models/university');
function removeext(str) {
  let noext = '';
  let extarr = str.split('.');
  for (var i = 0; i < extarr.length - 1; i++) {
    noext += extarr[i] + '.';
  }
  noext = noext.slice(0, -1);
  return noext;
}
// SAVE STREAM SESSIONS UID
const streamSessions = {};
exports.streamSessionsList = streamSessions;
app.get('/university', async (req, res, next) => {
  const universities = await University.find({});
  res.send(universities);
});
app.get('/university/:search', async (req, res, next) => {
  const search = req.params.search;
  const universities = await University.find({
    name: { $regex: search, $options: 'i' },
  });
  res.send(universities);
});
//universities setup
// app.get("/t",(req,res,next)=>{
//   fs.readFile('t.txt', function(err, data) {
//     if (err) throw err;
//     const lines=data.toString().split("\r");
//     let universities = [];
//     let current=0
//     let lastRank=0
//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i];
//       const tabs = line.split("\t");

//       if(i%3==0){
//         universities.push({
//           name: tabs[1]
//         })
//         current=universities.length-1
//       }else if(i%3==1){
//         universities[current].country=line.replace("\n","")
//       }else{

//         if(isNaN(parseFloat(tabs[1]))){
//           if(lastRank==0)
//             lastRank=universities.length
//           universities[current].score=0
//         }else{
//           if(isNaN(parseFloat(tabs[0])))
//             tabs.shift()
//           let score = parseFloat(tabs[0])
//           score += parseFloat(tabs[1])
//           score += parseFloat(tabs[2])
//           score += parseFloat(tabs[3])
//           score += parseFloat(tabs[4])
//           score += parseFloat(tabs[5])
//           score/=6
//           universities[current].score=score
//         }
//       }
//     }
//     universities.sort((a,b)=>{
//       return b.score-a.score
//     })
//     let rank=1
//     for (let i = 0; i < universities.length; i++) {
//       if(universities[i].score==0){
//         universities[i].rank=lastRank
//       }else{
//         if(i>0&&universities[i].score==universities[i-1].score){
//           universities[i].rank=universities[i-1].rank
//         }else{
//           universities[i].rank=rank
//         }
//       }
//       rank++
//     }
//     const University = require("./models/university");
//     University.insertMany(universities,(err,docs)=>{
//       if(err){
//         console.log(err)
//       }
//     })
//     res.send(universities);

//   });
// })
app.post('/user', middleware.decodeToken, userController.createOrLogin);
app.patch('/user/:userId', middleware.decodeToken, userController.update);
app.get('/question/:pid', questionController.getById);
// app.get('/post/:id/:tag', postController.getById, (req, res, next) => {
//   return res.send(req.data);
// });
app.get('/logout', (req, res, next) => {
  const uid = req.session.uid;
  req.session = null;
  res.end(uid);
});
// app.get('/post/:id/:tag/:order', postController.getById, (req, res, next) => {
//   return res.send(req.data);
// });
app.post('/cloudinary-signature', (req, res, next) => {
  const timestamp = new Date().getTime();
  const upload_preset =
    process.env.NODE_ENV == 'production' ? 'production' : 'development';
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, upload_preset },
    process.env.CLOUDINARY_SECRET
  );
  return res.send({
    timestamp,
    signature,
  });
});
app.post('/user/:userId/register-token', userController.registerToken);
app.get('/search', userController.search);
app.post('/search', userController.search);
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
const port = process.env.NODE_ENV == 'development' ? 5000 : 8080;
// start the server in the port 3000 !
app.listen(port, function () {
  console.log('Example app listening on port ' + port + '.');
});
