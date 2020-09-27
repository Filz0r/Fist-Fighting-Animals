const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../controllers/AuthController')
const User = require('../schemas/userSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    if(req.user.admin) {
        const data = []
        const u = await User.find()
        u.forEach(user => { data.push({name:  user.username , email: user.email, admin: user.admin })})
        console.log(data)    
        res.render('admin/admin.ejs', {user: req.user, users: data})
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }    
})

module.exports= router