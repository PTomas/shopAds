const express = require('express')
const passport = require('passport')
const path = require('path');
const { ensureAuth } = require('../middleware/isAuth.js')
const router = express.Router()

router.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/homePage.html"));
})

module.exports = router