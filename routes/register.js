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
    } else if (password.length < 6) {
        req.flash('message', 'Password must have more than 6 charecters!')
        return res.redirect('/register')
    } else {
        try {
            const hashedPw = await bcrypt.hash(password, 10)
            const id = await User.countDocuments()
            User.findOne({ email: email }).then((user) => {
                if (user) {
                    req.flash('message', 'That email already exists!')
                    res.redirect('/register')
                } else {
                    new User({
                        _id: id,
                        username,
                        email: email.toLowerCase(),
                        password: hashedPw,
                        admin: false,
                        level: 1,
                        attack: 5,
                        defense: 5,
                        HP: 10,
                        storyLvl: 1,
                        pointsToAdd: 0,
                        coins: 0,
                        storyCounter: 1,
                        new: true,
                    }).save().then( () => {
                        req.flash('message', 'You are now registered!')
                        res.redirect('/login')
                    })
                }
            })
        } catch (e) {
            console.log(e)
        }
    }
})

module.exports = router