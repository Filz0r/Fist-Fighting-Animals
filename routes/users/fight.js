const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../../controllers/AuthController')
const Animal = require('../../schemas/animalSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    const animals = await Animal.find({ storyLvl: req.user.storyLvl })
    const currentAnimal = animals[req.user.storyCounter - 1]
    const path = req.originalUrl

    res.render('users/fight', { user: req.user, path: path, animal: currentAnimal })
})

module.exports = router