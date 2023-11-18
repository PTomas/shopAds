import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from './models/user.js'

import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const dbURI = 'mongodb+srv://ptomas14:Runningtree2@shopusersdb.d6kumdz.mongodb.net/shopUsersDB?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then((result) => app.listen(port))
  .catch((err) => console.log(err))

app.post('/login', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  User.countDocuments({email: email, password: password})
    .then((result) => {
      if(result > 0){
        res.sendFile(path.join(__dirname, "/public/homePage.html"));
      }else{
        console.log('user not found')
      }
    })
    .catch((err) => {
      console.log(err);
    })
    
});

app.post('/homepage', async function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body.name);
  User.countDocuments({email: email, password: password})
    .then((result) => {
      if(result > 0){
        res.sendFile(path.join(__dirname, "/public/signUp.html"));
      }else{
        const user = new User({
          name: name,
          email: email,
          password: password
        })
        user.save()
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          })
          res.sendFile(path.join(__dirname, "/public/homePage.html"));
      }
    })
  
});

app.post('/signup', async function(req, res) {
  res.sendFile(path.join(__dirname, "/public/signUp.html"));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "/public/signIn.html"));
});

// app.listen(port, function () {
//   console.log('Server started at http://localhost:' + port);
// });