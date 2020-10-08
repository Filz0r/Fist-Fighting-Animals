const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const { checkAuthenticated } = require('../controllers/AuthController')
const User = require('../schemas/userSchema')
const Animal = require('../schemas/animalSchema')
const Items = require('../schemas/itemSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const userData = []
        const animalData = []
        const itemData = []
        const animals = await Animal.find()
        animals.forEach(animal => animalData.push({
            id: animal.id,
            name: animal.name,
            level: animal.level,
            category: animal.category,
            path: animal.img_path
        }))
        const users = await User.find()
        users.forEach(user => {
            userData.push({
                id: user.id,
                name: user.username,
                email: user.email,
                joinDate: user.joinDate.toLocaleString()
            })
        })
        const path = res.req.originalUrl
        const items = await Items.find()
        items.forEach(item => itemData.push({
            id: item.id,
            name: item.name,
            category: item.category,
            cost: item.cost
        }))
        res.render('admin/admin.ejs', { user: req.user, users: userData, animals: animalData, items: itemData, path: path })
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

router.get('/addItem', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const path = req.baseUrl
        res.render('admin/addItem', { user: req.user, path: path })
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

router.post('/addItem', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const { name, attack, defense, cost, categoryRadios: category} = req.body
        let { equipable } = req.body
        const id = await Items.countDocuments()
        const path = req.baseUrl
        typeof equipable == 'undefined' ? equipable = false : equipable
        const newItem = new Items({
            _id: id,
            name,
            category,
            effects: {
                attack,
                defense
            },
            cost,
            equipable
        })
        newItem.save()
        req.flash('changes', `Added ${name} to the item list!`)
        res.redirect('/admin')
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
        const { name, category, animalLevel: level, animalDefense: defense, animalAttack: attack, animalHP: HP, storyLvl, pointsToAdd, coinsDrop } = req.body
        const id = await Animal.countDocuments()
        const file = req.files.animalPictures
        const fileExtension = file.mimetype.slice(6, file.mimetype.length)
        file.name = `${id}.${fileExtension}`
        const uploadPath = `public/images/animals/${file.name}`
        file.mv(uploadPath, err => {
            if (err) {
                return console.log(err)
            } else {
                const n = new Animal({
                    _id: id,
                    name,
                    category,
                    level,
                    attack,
                    defense,
                    HP,
                    img_path: `/images/animals/${id}.${fileExtension}`,
                    storyLvl,
                    pointsToAdd,
                    coinsDrop
                })
                n.save()
                req.flash('changes', `Added ${name} to the animal list!`)
                res.redirect('/admin')
            }
        })
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
        const { name, category, animalLevel: level, animalAttack: attack, animalDefense: defense, animalHP: HP } = req.body
        await Animal.findByIdAndUpdate({ _id: req.params.id }, {
            name,
            category,
            level,
            attack,
            defense,
            HP,

        })
        req.flash('changes', `Animal ${name} was updated`)
        res.redirect('/admin')
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

router.post('/deleteAnimal/:id', checkAuthenticated, async (req, res) => {
    if (req.user.admin) {
        const animalToDelete = await Animal.findByIdAndDelete({ _id: req.params.id })
        req.flash('changes', `${animalToDelete.name} was deleted!`)
        res.redirect('/admin')
    } else {
        req.flash('message', 'You don\'t have access to this page!')
        res.redirect('/')
    }
})

module.exports = router