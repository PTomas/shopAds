const express = require('express')
const passport = require('passport')
const path = require('path');
const { passportConfig } = require('../passport.js')
const { ensureAuth } = require('../middleware/isAuth.js')
const router = express.Router()

router.use(require('express-session')({ secret: 'aquaman', resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

router.get('/homepage', (req, res) => {

    const userData = req.session.user || {};
    const adsenseData = req.session.adsenseData || {};
    console.log({ user: userData, adsenseData });
    res.sendFile(path.join(__dirname, "../public/homePage.html"));
})

module.exports = router