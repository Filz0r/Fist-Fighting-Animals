const express = require('express')
const User = require('../schemas/userSchema')
const router = express.Router()
const bcrypt = require('bcrypt')
const { checkNotAuthenticated } = require('../controllers/AuthController')

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

router.post('/', checkNotAuthenticated, async (req, res) => {
    const { username, email, password, password2 } = req.body
    if(password !== password2) {
        req.flash('message', 'Passwords do not match!')
        return res.redirect('/register')
    }
    try {
        const hashedPw = await bcrypt.hash(password, 10)
        const id = await User.countDocuments() + 1
        User.findOne({ email: email }).then((user) => {
            if (user) {
                req.flash('message', 'That email already exists!')
                res.redirect('/register')
            } else {
                new User({
                    _id: id,
                    username: username,
                    email: email,
                    password: hashedPw,
                    admin: false
                }).save().then(user => {
                    req.flash('message', 'You are now registered!')
                    res.redirect('/login')
                })
            }
        })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }

})

module.exports = router