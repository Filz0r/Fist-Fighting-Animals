const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../controllers/AuthController')

router.get('/', checkAuthenticated, (req, res) => {
    const path = res.req.originalUrl
    const root = process.env.INIT_CWD
    res.render('home.ejs', {user: req.user, path: path})
})

module.exports= router