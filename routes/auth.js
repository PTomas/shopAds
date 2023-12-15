const express = require('express')
const passport = require('passport')
const path = require('path');
const axios = require("axios");
const { google } = require('googleapis');
const { getGoogleAuthURL } = require('../passport.js');
const router = express.Router()
require('dotenv').config();


console.log('works')

const authClient = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CALLBACK_URL
);

router.post('/google', function (req, res) {
  const scope =['https://www.googleapis.com/auth/adsensehost'];

  const auth = authClient.generateAuthUrl({
    //'offline' mode will return a refresh token which we can save in our database to access the user's data in the future
    access_type: 'offline', 
    scope,
  });
  
  res.redirect(auth);
})

router.post('/google', passport.authenticate('google', { scope: ['profile'] }), (req, res) => {
})

router.get('/google/callback', passport.authenticate('google', { failureRedirect:
'/'}), (req, res) => {
  res.redirect("/homepage");
})

router.get('/googleapis/callback', async function (req, res) {
  res.redirect("/homepage");
  const code = req.query.code;

  const tokens = await authClient.getToken(code)
  authClient.setCredentials(tokens);

  const account = google.adsensehost({
    version: "v4.1",
    auth: process.env.API_KEY
  })

  const params = {
    
  };

  await account.accounts.get({
    accountId: "primary",
    auth: authClient
  }),
  async(accounts) => {
    console.log(accounts)
  }
});


router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
    console.log("user logged out")
  });
})

module.exports = router;