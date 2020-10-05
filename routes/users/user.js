const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../../controllers/AuthController')
const User = require('../../schemas/userSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    const path = req.originalUrl
    res.render('users/user', { user: req.user, path: path })
})
router.post('/:id', checkAuthenticated, async (req, res) => {
    const id = req.params.id
    const { userLevel: level, userStory: storyLvl, userPoints: pointsToAdd, userAttack: attack, userDefense: defense, userHP: HP } = req.body
    await User.findByIdAndUpdate({ _id: id }, {
        level,
        attack,
        defense,
        HP,
        storyLvl,
        pointsToAdd
    })
    res.redirect('/user')
})

module.exports = router