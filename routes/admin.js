const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const { checkAuthenticated } = require('../controllers/AuthController')
const User = require('../schemas/userSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const data = []
        const u = await User.find()
        u.forEach(user => { data.push({ id: user.id, name: user.username, email: user.email, joinDate: user.joinDate.toLocaleString() }) })
        res.render('admin/admin.ejs', { user: req.user, users: data })
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})
router.get('/edit/:id', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const userToEdit = await User.findById({ _id: req.params.id })
        res.render('admin/edit', { users: userToEdit })
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }

})

router.post('/delete/:id', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        await User.findByIdAndDelete({ _id: req.params.id })
        req.flash('changes', 'User deleted')
        res.redirect('/admin')
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

router.post('/save/:id', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const { newPw, checkNewPw } = req.body
        console.log(req.body)        
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
                    password: pass,
                    level: req.body.userLevel,
                    attack: req.body.userAttack,
                    deffense: req.body.userDefense,
                    HP: req.body.userHP
                })
            req.flash('changes', 'User edited!')
            res.redirect('/admin')
        }
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})
module.exports = router