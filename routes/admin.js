const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const { checkAuthenticated } = require('../controllers/AuthController')
const User = require('../schemas/userSchema')
const Animal = require('../schemas/animalSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const userData = []
        const animalData = []
        const animals = await Animal.find()
        animals.forEach(animal => animalData.push({ id: animal.id, name: animal.name, level: animal.level, category: animal.category }))
        const users = await User.find()
        users.forEach(user => { userData.push({ id: user.id, name: user.username, email: user.email, joinDate: user.joinDate.toLocaleString() }) })
        const path = res.req.originalUrl
        res.render('admin/admin.ejs', { user: req.user, users: userData, animals: animalData, path: path })
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

router.get('/addUser', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {

    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

router.get('/edit/:id', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const path = req.baseUrl
        const userToEdit = await User.findById({ _id: req.params.id })
        res.render('admin/edit', { user: req.user, users: userToEdit, path: path })
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

router.get('/addAnimal', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const path = req.baseUrl
        res.render('admin/addAnimal', { user: req.user, path: path })
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

router.post('/addAnimal', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const { name, category, animalLevel: level, animalDefense: defense, animalAttack: attack, animalHP: HP } = req.body
        const id = await Animal.countDocuments()
        await new Animal({
            _id: id,
            name,
            category,
            level,
            attack,
            defense,
            HP
        }).save()
        req.flash('changes', 'Added a new Animal!')
        res.redirect('/admin')
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

router.get('/editAnimal/:id', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const path = req.baseUrl
        const animalToEdit = await Animal.findById({ _id: req.params.id })
        res.render('admin/edit', { user: req.user, animals: animalToEdit, path: path })
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

router.post('/saveAnimal/:id', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const { name, category, animalLevel: level, animalAttack: attack, animalDefense: defense, animalHP: HP} = req.body
        await Animal.findByIdAndUpdate({ _id: req.params.id }, {
            name,
            category,
            level,
            attack,
            defense,
            HP
        })
        req.flash('changes', `Animal ${ name } was updated`)
        res.redirect('/admin')
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

router.post('/deleteAnimal/:id', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const animalToDelete = await Animal.findByIdAndDelete({ _id: req.params.id })
        console.log(animalToDelete)
        req.flash('changes', `${animalToDelete.name} was deleted!`)
        res.redirect('/admin')
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

module.exports = router