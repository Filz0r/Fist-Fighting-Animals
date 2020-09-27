const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../controllers/AuthController')

router.get('/', checkAuthenticated, (req, res) => {
    res.render('home.ejs', {user: req.user})
})

module.exports= router