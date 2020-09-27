const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../controllers/AuthController')
const User = require('../schemas/userSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    if(req.user.admin) {
        const data = []
        const u = await User.find()
        u.forEach(user => { data.push({id: user.id, name:  user.username , email: user.email, joinDate: user.joinDate.toLocaleString() })})
        console.log(data)    
        res.render('admin/admin.ejs', {user: req.user, users: data})
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }    
})
router.get('/edit/:id', checkAuthenticated, async(req, res) => {
    if(req.user.admin) {
        const userToEdit = await User.findById({_id: req.params.id})
        console.log(userToEdit)
        res.render('admin/edit', {users: userToEdit})
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
    
})

module.exports= router