require('dotenv/config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const userController = require('./controllers/userController');

const notificationsRouter = require('./routers/notificationsRouter');
const questionsRouter = require('./routers/questionsRouter');
const notesRouter = require('./routers/notesRouter');
const userRouter = require('./routers/userRouter');
const fbAuthRouter = require('./routers/fbAuthRouter');

const University = require('./models/university');
const Company = require('./models/company');

const cloudinary = require('./utils/cloudinary');

var app = express();
const mongoose = require('mongoose');

let { eventsHandler } = require('./utils/eventsHandler');
const Middleware = require('./middleware/Middleware');
console.log(
  'mongodb+srv://papayask:' +
    process.env.MONGODB_PASSWORD +
    '@cluster' +
    (process.env.NODE_ENV == 'production' ? 0 : 1) +
    '.m1q2dzz.mongodb.net/?retryWrites=true&w=majority'
);

const origin =
  process.env.NODE_ENV == 'development'
    ? [
        'http://localhost:3000',
        'http://localhost:58550',
        'https://www.papayask.com',
        'https://papayask.com',
      ]
    : process.env.NODE_ENV == 'production'
    ? ['https://www.papayask.com', 'https://papayask.com']
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

const domain =
  process.env.NODE_ENV == 'development' ? 'localhost:3000' : 'papayask.com';

app.use(
  session({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000 * 365,
    domain: domain,
  })
);
app.use(
  cors({
    origin: origin,
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(
  'mongodb+srv://papayask:' +
    process.env.MONGODB_PASSWORD +
    '@cluster' +
    (process.env.NODE_ENV == 'production' ? '0.movlb' : '1.m1q2dzz') +
    '.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// on the request to root (localhost:3000/)
const db = mongoose.connection;
db.once('open', () => {
  console.log('Successfully connected to MongoDB using Mongoose!');
});

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
app.get('/token/user/', Middleware.getUser);
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

app.get('/realtime-notifications/:id', eventsHandler);
app.get('/search', userController.search);
app.post('/search', userController.search);
app.get('/searchauto', userController.searchAutomationResults);
app.post('/searchauto', userController.searchAutomationResults);
app.use('/notifications', notificationsRouter);
app.use('/questions', questionsRouter);
app.use('/note', notesRouter);
app.use('/user', userRouter);
app.use('/firebase', fbAuthRouter);
app.get('/company/:search', async (req, res, next) => {
  const search = req.params.search;
  const companies = await Company.find({
    name: { $regex: search, $options: 'i' },
  });
  res.json({ companies });
});

app.get('/logout', (req, res, next) => {
  const uid = req.session.uid;
  req.session = null;
  res.end(uid);
});

app.post('/cloudinary-signature', async (req, res, next) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const upload_preset =
    process.env.NODE_ENV == 'production' ? 'production' : 'development';
  const params = { timestamp: timestamp, upload_preset: upload_preset };
  const signature = await cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET
  );
  return res.send({
    timestamp,
    signature,
  });
});

// Change the 404 message modifing the middleware
app.use(function (req, res, next) {
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});
const port = process.env.NODE_ENV == 'development' ? 5000 : 8080;
// start the server in the port 3000 !
app.listen(port, function () {
  console.log('Example app listening on port ' + port + '.');
});
