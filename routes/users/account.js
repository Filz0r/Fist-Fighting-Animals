const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../../controllers/AuthController')
const User = require('../../schemas/userSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    const path = req.originalUrl
    res.render('users/account', { user: req.user, path: path })
})

module.exports = router