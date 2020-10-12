const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../../controllers/AuthController')
const { bagSorter, itemChecker } = require('../../controllers/itemHandler')
const User = require('../../schemas/userSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    const path = req.originalUrl
    const bag = await bagSorter(req.user.id)
    //const items = await itemChecker(req.user.id)
    //console.log(items)
    res.render('users/user', { user: req.user, bag: bag, path: path })
})
router.post('/:id', checkAuthenticated, async (req, res) => {
    const id = req.params.id
    const { userPoints: pointsToAdd, userAttack: attack, userDefense: defense, userHP: HP } = req.body
    await User.findByIdAndUpdate({ _id: id }, {
        attack,
        defense,
        HP,
        pointsToAdd
    })
    res.redirect('/user')
})

module.exports = router