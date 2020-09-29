const express = require('express')
const passport = require('passport')
const { checkNotAuthenticated } = require('../controllers/AuthController')

const router = express.Router()

router.get('/', checkNotAuthenticated, (req, res) => {
     res.render('login.ejs')
 })

router.post('/', checkNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})


module.exports = router