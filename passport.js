const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('./models/user.js')

const GOOGLE_CLIENT_ID = '305484461229-s65eo0ucnnitc1ocaavia4uk8sbgfo5h.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const absoluteURI = "https://habitualbuy-b8ff67b7526e.herokuapp.com"

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: absoluteURI + "/auth/google/callback"
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
      }));
     
      passport.serializeUser(function (user, done){
        done(null, user.id)
      })

      passport.deserializeUser(function (id, done){
        User.findById(id, function (err, user) {
            done(err, user)
        })
      })


    // app.get('/auth/google', 
    //   passport.authenticate('google', { scope : ['profile', 'email'] }));
     
    // app.get('/auth/google/callback', 
    //   passport.authenticate('google', { failureRedirect: '/error' }),
    //   function(req, res) {
    //     // Successful authentication, redirect success.
    //     res.redirect('/success');
    //   });
}
