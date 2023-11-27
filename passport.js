const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
const User = require('./models/user.js')

const GOOGLE_CLIENT_ID = '305484461229-s65eo0ucnnitc1ocaavia4uk8sbgfo5h.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const absoluteURI = "http://localhost:3000"
const absoluteURI1 ="https://habitualbuy-b8ff67b7526e.herokuapp.com"

function passportConfig(passport){
    const oauth2Client = passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: absoluteURI1 + "/auth/google/callback",
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

      
        const adsenseData = await getAdSenseData(accessToken, refreshToken );
        console.log(adsenseData);

      }));
     
      passport.serializeUser(function (user, done){
        done(null, user.id)
      })

      passport.deserializeUser(function (id, done){
        User.findById(id, function (err, user) {
            done(err, user)
        })
      })

      async function getAdSenseData(accessToken, refreshToken) {
        try {
          const response = await axios.get('https://www.googleapis.com/adsensehost/v4.1/accounts', {
            headers: {
              Authorization: `Bearer: ${refreshToken}`,
            },
            // Add any additional parameters or configurations needed for your AdSense API request
          });
      
          return response.data; // Adjust this based on the actual structure of AdSense API response
        } catch (error) {
          if (error.response && error.response.status === 403) {
            // If the error is due to token expiration, handle token refreshing here
            // ...
          } else {
            console.error('Error fetching AdSense data:', error.message);
            return null;
          }
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