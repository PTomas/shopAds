const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');
const passport = require('passport');
const process = require('process');
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');;
const readline = require('readline');
const fs = require('fs').promises;
const User = require('./models/user.js')

const adsensehost = google.adsensehost("v4.1");

const GOOGLE_API_KEY = 'AIzaSyAkLooAdkWACaHPpJvA5JWd8BPJYlUOZFw';
const GOOGLE_CLIENT_ID = '305484461229-s65eo0ucnnitc1ocaavia4uk8sbgfo5h.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const absoluteURI = "http://localhost:3000/auth/google/callback"
const absoluteURI1 ="http://habitualbuy-b8ff67b7526e.herokuapp.com/auth/google/callback"


function passportConfig(passport){
    const oauth2Client = new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: absoluteURI1,
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


      function getData(authClient){
        const Data = google.adsensehost({
          version: 'v4.1',
          auth: authClient
        });
  
        const params = {
          accountId: profile.id
        };
  
        Data.accounts.get(params, (err, res) => {
          if (err) {
            console.log(err)
            throw err;
          }
          console.log(res.data)
        })
      }

      module.exports = { getGoogleAuthURL }
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