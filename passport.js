const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');
const passport = require('passport');
const express = require('express');
const session = require('express-session')
const axios = require('axios');
const User = require('./models/user.js')


const GOOGLE_API_KEY = 'AIzaSyAkLooAdkWACaHPpJvA5JWd8BPJYlUOZFw';
const GOOGLE_CLIENT_ID = '305484461229-s65eo0ucnnitc1ocaavia4uk8sbgfo5h.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const absoluteURI = "http://localhost:3000"
const absoluteURI1 ="https://habitualbuy-b8ff67b7526e.herokuapp.com"


function passportConfig(passport){
  var auths = {};
    const oauth2Client = new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        accessTokenURL: "https://oauth2.googleapis.com/token",
        callbackURL: absoluteURI + "/auth/google/callback",
        scopes: ['https://www.googleapis.com/host/adsensehost']
      },
      async(accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            Image: profile.photos[0].value
        }

        try {
            let user = await User.findOne({ googleId: profile.id })

            if(user) {
                done(null, user)
                console.log("user logged in");
            }else{
                user = await User.create(newUser);
                done(null, user)
            }
        } catch (err) {
            console.log(err)
        }

      // auths[req.session.id] = oauth2Client


      oauth2Client.credentials = accessToken;

      const Data = google.adsensehost({
        version: 'v4.1',
        auth: GOOGLE_API_KEY
      });

      const params = {
        accountId: profile.id
      };

      Data.accounts.get(params, (err, res) => {
        if (err) {
          console.log(err)
          throw err;
        }
        console.log(res)
      })
        // const adsenseData = await getAdSenseData(accessToken, refreshToken);
        // console.log(adsenseData);
      });
     
      passport.serializeUser(function (user, done){
        done(null, user.id)
      })

      passport.deserializeUser(function (id, done){
        User.findById(id, function (err, user) {
            done(err, user)
        })
      })

      
  passport.use(oauth2Client);

}


module.exports = { passportConfig }