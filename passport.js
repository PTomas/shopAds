const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
const User = require('./models/user.js')

const router = express.Router()

router.use(require('express-session')({ secret: 'aquaman', resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

const GOOGLE_CLIENT_ID = '305484461229-s65eo0ucnnitc1ocaavia4uk8sbgfo5h.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const absoluteURI = "https://habitualbuy-b8ff67b7526e.herokuapp.com"

function passportConfig(passport){
    const oauth2Client = passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: absoluteURI + "/auth/google/callback",
        scopes: ['https://www.googleapis.com/auth/adsensehost']
      },
      async(acessToken, refreshToken, profile, done) => {
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

        const adsenseData = await getAdSenseData(accessToken);
        req.session.adsenseData = adsenseData;

      }));
     
      passport.serializeUser(function (user, done){
        done(null, user.id)
      })

      passport.deserializeUser(function (id, done){
        User.findById(id, function (err, user) {
            done(err, user)
        })
      })

      async function getAdSenseData(accessToken) {
        try {
          const response = await axios.get('https://www.googleapis.com/adsensehost/v4.1/reports', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            // Add any additional parameters or configurations needed for your AdSense API request
          });
      
          return response.data; // Adjust this based on the actual structure of AdSense API response
        } catch (error) {
          console.error('Error fetching AdSense data:', error.message);
          return null;
        }
      }
    // app.get('/auth/google', 
    //   passport.authenticate('google', { scope : ['profile', 'email'] }));
     
    // app.get('/auth/google/callback', 
    //   passport.authenticate('google', { failureRedirect: '/error' }),
    //   function(req, res) {
    //     // Successful authentication, redirect success.
    //     res.redirect('/success');
    //   });
}

module.exports = { passportConfig }