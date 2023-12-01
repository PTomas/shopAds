const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');
const passport = require('passport');
const express = require('express');
const readline = require('readline');
const fs = require('fs');
const User = require('./models/user.js')

const adsensehost = google.adsensehost("v4.1");

const GOOGLE_API_KEY = 'AIzaSyAkLooAdkWACaHPpJvA5JWd8BPJYlUOZFw';
const GOOGLE_CLIENT_ID = '305484461229-s65eo0ucnnitc1ocaavia4uk8sbgfo5h.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const absoluteURI = "http://localhost:3000/auth/google/callback"
const absoluteURI1 ="https://habitualbuy-b8ff67b7526e.herokuapp.com/auth/google/callback"


function passportConfig(passport){
  var auths = {};
    const oauth2Client = new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        accessTokenURL: "https://oauth2.googleapis.com/token",
        callbackURL: absoluteURI,
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
      
        const TOKEN_PATH = 'token.json';

        fs.readFile('credentials.json', (err, content) => {
          if (err) return console.log('Error loading client secret file:', err);
          authorize(JSON.parse(content), getData);
        });

      function authorize(credentials, callback){
        const client_id = credentials.client_id;
        const client_secret = credentials.client_secret;
        const redirect_url = credentials.redirect_url;
        var authClient = new google.auth.OAuth2(client_id, client_secret, redirect_url[0]);
        authClient.credentials = credentials;

        getAccessToken(authClient, callback);
      }

      function getAccessToken(authClient, callback) {
        const authUrl = authClient.generateAuthUrl({
          access_type: 'offline',
          scope: 'https://www.googleapis.com/adsensehost/v4.1/accounts',
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
          rl.close();
          auth.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            authClient.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
              if (err) return console.error(err);
              console.log('Token stored to', TOKEN_PATH);
            });
            getData(authClient);
          });
        });
      }

      function getData(auth){
        const Data = google.adsensehost({
          version: 'v4.1',
          auth: auth
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
      }
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