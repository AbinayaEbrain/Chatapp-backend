const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const _ = require('lodash');

const app = express();

const dbConfig = require('./config/secret');

//After installing socket.io
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const { User } = require('./Helpers/userClass');

//"io" is coming from above require socket.io
require('./socket/streams')(io, User, _);
require('./socket/private')(io);

//require the created route here
const auth = require('./routes/authRoutes');
const posts = require('./routes/postRoutes');
const users = require('./routes/userRoutes');
const friends = require('./routes/friendsRoutes');
const message = require('./routes/messageRoutes');
const image = require('./routes/imageRoutes');

app.use(cors());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PATCH, PUT, DELETE, OPTIONS'
//   );
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, Content-Type, X-Requested-With,Authorization,Accept'
//   );
//   next();
// });

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
//app.use(logger('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, { useNewUrlParser: true });

//to use the path
app.use('/api/chatapp', auth);
app.use('/api/chatapp', posts);
app.use('/api/chatapp', users);
app.use('/api/chatapp', friends);
app.use('/api/chatapp', message);
app.use('/api/chatapp', image);

//Before installing socket.io
// app.listen(3000, () => {
//   console.log('Running on port 3000');
// });

//After installing socket.io
server.listen(3000, () => {
  console.log('Running on port 3000');
});
