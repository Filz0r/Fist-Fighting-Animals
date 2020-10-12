const User = require('../schemas/userSchema')
const Items = require('../schemas/itemSchema')
const Animals = require('../schemas/animalSchema')

async function itemGiver(userId) {
    const itemIdCheck = await itemIdChecker(userId)
    const equipArr = await itemsInBagEquipChecker(itemIdCheck)
    
    
    let { storyLvl, storyCounter } = await User.findById({ _id: userId })
    const { itemsToDrop } = await Animals.findById({ _id: storyCounter })
    
    //creates the objects that are to be inserted in the database
    const itemsToUpload = async(itemsToDrop)  => {
        let i = 0
        const itemDropData = []
        //let dropCheck = true
        do {
            const idOfItemsToDrop = itemsToDrop[i]
            const { name, category, effects, equipable, _id: id } = await Items.findById({ _id: idOfItemsToDrop })
            //this will add items to the users bag if they dont have it
            if (typeof itemIdCheck[i] == 'undefined') {
                const item = {
                    id,
                    name,
                    category,
                    effects,
                    equipable
                }
                itemDropData.push(item) 
            i++
            } else {
                i++
                //dropCheck = false
            }
        } while (i < itemsToDrop.length)
        return itemDropData
    }
    const test = await itemsToUpload(itemsToDrop)
    console.log(test)
    
    
    
}

//grabs the ID's of all the items the user has in his bag
async function itemIdChecker(userId) {
    const { bag } = await User.findById({ _id: userId })
    if (bag.length < 1) return false
    const bagCheck = Object.values(bag).map((item) => {
        const id = item.id
        return id
    })
    return bagCheck
}
//Checks if the items the user has in his bag can be equiped or not, returns an array of true or false
async function itemsInBagEquipChecker(ids) {
    if (ids === false) return
    const result = []
    let i = 0
    do {
        const { equipable } = await Items.findById({ _id: ids[i] })
        result.push(equipable)
        i++
    } while (i < ids.length)
    return result
}

async function bagSorter(userId) {
    const { bag } = await User.findById({ _id: userId })
    if (bag.length < 1) return sortedNothing = {}
    const bagToSort = Object.values(bag)
    const sortedBag = []
    let i = 0
    do {
        const itemsInBag = {
            name: bagToSort[i].name,
            category: bagToSort[i].category,
            equipable: bagToSort[i].equipable,
            effects: bagToSort[i].effects,
            equiped: bagToSort[i].equiped
        }
        i++
        sortedBag.push(itemsInBag)
    } while (bagToSort.length < i)
    return sortedBag
}

module.exports = { itemGiver, itemIdChecker, bagSorter, itemsInBagEquipChecker }

//if the user has no items in the bag
    /*if (typeof equipArr == 'undefined') {
        i = 0
        do {
            if (items[i].category == 'armor') {
                const itemToGive = {
                    id: items[i].id,
                    name: items[i].name,
                    category: items[i].category,
                    effects: items[i].effects,
                    equipable: items[i].equipable,
                    equiped: false
                }
                await User.findByIdAndUpdate({ _id: userId }, {
                    $push: {
                        bag: itemToGive
                    }
                })
            }
            if (items[i].category == 'consumable') {
                const itemToGive = {
                    id: items[i].id,
                    name: items[i].name,
                    category: items[i].category,
                    effects: items[i].effects,
                    equipable: items[i].equipable,
                    quantity: 1
                }
                await User.findByIdAndUpdate({ _id: userId }, {
                    $push: {
                        bag: itemToGive
                    }
                })
            }
            i++
        } while (i < items.length)

    } else {
        i = 0
        do {
            if (typeof items[i] == 'undefined') {
                i++
            } else {
                //if the item is not equipable increase its quantity
                if (!equipArr[i]) {
                    let { bag } = await User.findById({
                        _id: userId
                    })
                    const bagObj = Object.values(bag)
                    const indexOfItem = bagObj.findIndex(n => n.name === items[i].name)
                    bag[indexOfItem].quantity += 1
                    await User.findByIdAndUpdate({ _id: userId }, {
                        bag
                    })
                }
                i++
            }
        } while (i < items.length)
    }*/