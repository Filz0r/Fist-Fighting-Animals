const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { checkAuthenticated } = require('../../controllers/AuthController')
const User = require('../../schemas/userSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    const path = req.originalUrl
    res.render('users/account', { user: req.user, path: path })
})
router.post('/:id', checkAuthenticated, async (req, res) => {
    const { newPw, checkNewPw } = req.body
        if (await bcrypt.compare(newPw, req.user.password)) {
            req.flash('changes', 'password is the same as old one')
            res.redirect(`/admin/edit/${req.params.id}`)
        } else if (newPw !== checkNewPw) {
            req.flash('changes', 'new passwords do not match!')
            res.redirect(`/admin/edit/${req.params.id}`)
        } else {
            const hashedPW = await bcrypt.hash(newPw, 10)
            const pass = newPw.length > 0 ? hashedPW : req.user.password
            await User.findByIdAndUpdate({ _id: req.params.id }, {
                username: req.body.username,
                email: req.body.email,
                password: pass
            })
            req.flash('changes', 'User edited!')
            res.redirect('/account')
        }
})

module.exports = router