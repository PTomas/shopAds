import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

import { getUsers, selectUser, createUser } from './database.js'
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

const emails = [];
const passwords = [];

app.post('/login', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const users = await selectUser(email, password)   
  if(users === undefined){
    console.log("error")
  }else{
    console.log(users);
    res.sendFile(path.join(__dirname, "/public/homePage.html"));
  }
});

app.post('/homepage', async function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body.name);
  const newUser = await createUser(name, email, password)
  console.log(newUser);
  res.sendFile(path.join(__dirname, "/public/homePage.html"));
});

app.post('/signup', async function(req, res) {
  res.sendFile(path.join(__dirname, "/public/signUp.html"));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "/public/signIn.html"));
});

app.listen(port, function () {
  console.log('Server started at http://localhost:' + port);
});