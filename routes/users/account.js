const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { checkAuthenticated } = require('../../controllers/AuthController')
const { setEmailToLowerCase } = require('../../controllers/utils')
const User = require('../../schemas/userSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    const path = req.originalUrl
    res.render('users/account', { user: req.user, path: path })
})
router.post('/:id', checkAuthenticated, async (req, res) => {
    const { formInfo, username, password, email, newEmail, confirmNewEmail, newPassword, confNewPassword } = req.body
    const { coins, password: userPw, email: userEmail } = req.user
    const dbNames = await User.findOne({ username })
    const dbEmails = await User.findOne({ email: newEmail })
    if (formInfo == 'general') {
        if (await bcrypt.compare(password, userPw)) {
            if (dbNames.length != 0) {
                req.flash('changes', 'This username already exists!')
                res.redirect('/account')
            } else if (coins < 1000) {
                req.flash('changes', 'You don\'t have enough coins!')
                res.redirect('/account')
            } else {
                await User.findByIdAndUpdate({ _id: req.params.id }, {
                    username: req.body.username,
                    coins: coins - 1000
                })
                req.flash('success', 'You have changed your username!')
                res.redirect('/account')
            }
        } else {
            req.flash('changes', 'Please provide a valid password!')
            res.redirect('/account')
        }

    } else if (formInfo == 'email') {
        if (await bcrypt.compare(password, userPw)) {
            const lowNewEmail = setEmailToLowerCase(newEmail)
            const lowConfirmNewEmail = setEmailToLowerCase(confirmNewEmail)
            if (lowNewEmail !== lowConfirmNewEmail) {
                req.flash('changes', 'The emails do not match!')
                res.redirect('/account')
            }
            else if (dbEmails != null) {
                req.flash('changes', 'This email already has an account registered to it!')
                res.redirect('/account')
            } else if (coins < 10000) {
                req.flash('changes', 'You don\'t have enough coins!')
                res.redirect('/account')
            } else {
                await User.findByIdAndUpdate({ _id: req.params.id }, {
                    email: newEmail,
                    coins: coins - 10000
                })
                req.flash('success', 'You have changed your email!')
                res.redirect('/account')
            }
        } else {
            req.flash('changes', 'Please provide a valid password!')
            res.redirect('/account')
        }

    } else if (formInfo == 'password') {
        if (newPassword != confNewPassword) {
            req.flash('changes', 'The new passwords do not match!')
            res.redirect('/account')
        } else if(newPassword.length < 6) {
            req.flash('changes', 'The password must have more than 6 characters')
            res.redirect('/account')
        } else {
            if (userEmail == setEmailToLowerCase(email)) {
                if (await bcrypt.compare(password, userPw)) {
                    const hashedPW = await bcrypt.hash(newPassword, 10)
                    await User.findByIdAndUpdate({_id: req.params.id}, {
                        password: hashedPW
                    })
                    req.flash('success', 'Password Changed!')
                    res.redirect('/account')
                } else {
                    req.flash('changes', 'Incorrect password!')
                    res.redirect('/account')
                }
            } else {
                req.flash('changes', 'Provided email does not match the account email!')
                res.redirect('/account')
            }
        }
    } else {
        req.flash('changes', 'There was an error')
        res.redirect('/account')
    }
})

module.exports = router