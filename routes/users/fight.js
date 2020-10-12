const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../../controllers/AuthController')
const { itemGiver } = require('../../controllers/itemHandler')
const Animal = require('../../schemas/animalSchema')
const User = require('../../schemas/userSchema')
//const Items = require('../../schemas/itemSchema')


router.get('/', checkAuthenticated, async (req, res) => {
    const animals = await Animal.find({ storyLvl: req.user.storyLvl })
    const currentAnimal = animals[req.user.storyCounter]
    //console.log(`CurrentAnimal: ${currentAnimal}`)
    const path = req.originalUrl
    res.render('users/fight', { user: req.user, path: path, animal: currentAnimal })
    itemGiver(req.user.id)
})
router.post('/', checkAuthenticated, async (req, res) => {
    const animals = await Animal.find({ storyLvl: req.user.storyLvl })
    const { pointsToAdd, coinsDrop } = animals[req.user.storyCounter - 1]
    let { _id, pointsToAdd: points, coins, storyCounter, storyLvl } = await User.findById({ _id: req.user.id })
    const storyLvlChanger = storyCounter % 5
    console.log(`LVL CHANGER:${storyLvlChanger}`)
    if (storyLvlChanger == 0) {
        points += pointsToAdd
        coins += coinsDrop
        storyCounter += 1
        storyLvl += 1
        itemGiver(req.user.id)
        await User.findByIdAndUpdate({ _id }, {
            pointsToAdd: points,
            coins,
            storyCounter,
            storyLvl
        })
    } else {
        points += pointsToAdd
        coins += coinsDrop
        storyCounter += 1
        itemGiver(req.user.id)
        await User.findByIdAndUpdate({ _id }, {
            pointsToAdd: points,
            coins,
            storyCounter
        })
    }
    res.redirect('/fight')
})


router.post('/loss', checkAuthenticated, async (req, res) => {
    res.redirect('/fight')
})
module.exports = router