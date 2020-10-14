const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../../controllers/AuthController')
const { bagSorter, itemIdChecker } = require('../../controllers/itemHandler')
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
    const itemsInBag = await itemIdChecker(req.user.id)
    if(!itemsInBag.includes(parseInt(req.params.id))) {
        req.flash('changes', 'You cannot equip an item you do not have! \nThis error only appears when you try to fool the game ;)')
        res.redirect('/user')
    } else {
        const itemToEquip = await Items.findById({ _id: req.params.id })
        if (itemToEquip.equipable) {
            let { bag, armor } = await User.findById({ _id: req.user.id })
            const itemIndexInBag = Object.values(bag).findIndex((item) => {
                return item.id == req.params.id
            })
            const indexOfEquipedItem = Object.values(bag).findIndex((item) => {
                return item.equiped == true
            })
            armor.attack = itemToEquip.effects.attack
            armor.defense = itemToEquip.effects.defense
            bag[itemIndexInBag].equiped = true
            bag[indexOfEquipedItem].equiped = false
            await User.findByIdAndUpdate({ _id: req.user.id }, {
                armor,
                bag
            })
            req.flash('success', `You have equiped ${itemToEquip.name}`)
            res.redirect('/user')
        } else {
            req.flash('changes', 'You can not equip that item! \nThis error only appears when you try to fool the game ;)')
            res.redirect('/user')
        }
    }
    
})

router.get('/use/:id', checkAuthenticated, async (req, res) => {
    const itemsInBag = await itemIdChecker(req.user.id)
    if(!itemsInBag.includes(parseInt(req.params.id))) {
        req.flash('changes', 'You cannot use an item you do not have! \nThis error only appears when you try to fool the game ;)')
        res.redirect('/user')
    } else {
        const { equipable, effects, usageCount, name } = await Items.findById({ _id: req.params.id })
        console.log(usageCount)
        if (!equipable) {
            if (req.user.consumableCounter == 0) {
                let { consumableCounter, consumableEffects, bag } = await User.findById({_id: req.user.id})
                consumableCounter = usageCount
                consumableEffects.attack = effects.attack
                consumableEffects.defense = effects.defense
                const indexOfItemToUse = Object.values(bag).findIndex((item) => item.id == req.params.id)
                bag[indexOfItemToUse].quantity -=1
                await User.findByIdAndUpdate({_id: req.user.id}, {
                    bag,
                    consumableCounter,
                    consumableEffects
                })
                req.flash('success', `You have used ${name}, it will work for the next ${usageCount} fight(s)`)
                res.redirect('/user')
            } else {
                req.flash('changes', 'You already have an item buffing your stats!')
                res.redirect('/user')
            }
        } else {
            req.flash('changes', 'You can only equip that item! \nThis error only appears when you try to fool the game ;)')
            res.redirect('/user')
        }
    }
    
})
module.exports = router