const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../../controllers/AuthController')
const { bagSorter } = require('../../controllers/itemHandler')
const User = require('../../schemas/userSchema')
const Items = require('../../schemas/itemSchema')

router.get('/', checkAuthenticated, async (req, res) => {
    const path = req.originalUrl
    const bag = await bagSorter(req.user.id)
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
router.get('/equip/:id', checkAuthenticated, async (req, res) => {
 const itemToEquip = await Items.findById({_id: req.params.id})
 if (itemToEquip.equipable) {
    let { bag, armor } = await User.findById({_id: req.user.id})
    const itemIndexInBag = Object.values(bag).findIndex((item) => {
        return item.id == req.params.id 
    })
    const indexOfEquipedItem = Object.values(bag).findIndex((item) => {
        return item.equiped == true
    })
    console.log(armor)
    armor.attack = itemToEquip.effects.attack
    armor.defense = itemToEquip.effects.defense
    console.log(armor)
    bag[itemIndexInBag].equiped = true
    bag[indexOfEquipedItem].equiped = false
    await User.findByIdAndUpdate({_id: req.user.id }, {
        armor,
        bag
    })
    req.flash('success', `You have equiped ${itemToEquip.name}`)
    res.redirect('/user')
 }
})

module.exports = router