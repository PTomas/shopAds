const express = require('express');
const session = require('express-session')
const path = require('path');
const bodyParser = require('body-parser');
const url = require('url'); 
const mongoose = require('mongoose');
const User = require('./models/user.js');
const cors = require('cors');
const exhbs = require('express-handlebars')
const { error } = require('console');
const passport = require('passport');
const passportConfig = require('./passport.js')



// const __filename = path.basename(__filename)
// const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.use(cors({origin: port,
methods: "GET,POST,PUT,DELETE",
credentials: true,}));

app.use(session({
  secret: 'aquaman',
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/auth.js'));

const dbURI = 'mongodb+srv://ptomas14:Runningtree2@shopusersdb.d6kumdz.mongodb.net/shopUsersDB?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then((result) => app.listen(port))
  .catch((err) => console.log(err))

// app.post('/homepage', ensureAuth , (req, res) => {
//   res.sendFile(path.join(__dirname, "/public/homePage.html"));
// });

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "/public/googleAuth.html"));
});

// app.listen(port, function () {
//   console.log('Server started at http://localhost:' + port);
// });