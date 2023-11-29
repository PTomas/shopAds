const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user.js');
const exphbs = require('express-handlebars')
const { error } = require('console');
const passport = require('passport');
const { passportConfig } = require('./passport.js');
// const router = require('./routes/index.js');
const router = require('./routes/auth.js');

// const __filename = path.basename(__filename)
// const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var MemoryStore =session.MemoryStore;
app.set('trust proxy', 1) 
app.use(session({
  name : 'shopads.sid',
  secret: 'aquaman',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore(),
  cookie: { secure: true }
}))

app.use(router)

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/auth.js'));

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

const dbURI = 'mongodb+srv://ptomas14:Runningtree2@shopusersdb.d6kumdz.mongodb.net/shopUsersDB?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then((result) => app.listen(port))
  .catch((err) => console.log(err))

