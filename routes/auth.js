const express = require('express')
const passport = require('passport')
const path = require('path');
const passportConfig = require('../passport.js')
const router = express.Router()

console.log('works')
router.post('/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/google/callback', passport.authenticate('google', { failureRedirect:
'/'}), (req, res) => {
  res.redirect("/homepage");
})

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