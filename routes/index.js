const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../controllers/AuthController')

router.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.username})
})

module.exports= router