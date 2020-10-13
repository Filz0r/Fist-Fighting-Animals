const User = require('../schemas/userSchema')
const Items = require('../schemas/itemSchema')
const Animals = require('../schemas/animalSchema')

async function itemGiver(userId) {
    const itemIdCheck = await itemIdChecker(userId)
    let { storyCounter } = await User.findById({ _id: userId })
    const { itemsToDrop } = await Animals.findById({ _id: storyCounter })

    //creates the objects that are to be inserted in the database
    const itemsToUpload = async (itemsToDrop) => {
        let i = 0
        const toUpload = {
            itemUpdateData: [],
            itemDropData: []
        }
        do {
            const idOfItemsToDrop = itemsToDrop[i]
            const { name, category, effects, equipable, _id: id } = await Items.findById({ _id: idOfItemsToDrop })
            // this will check if the items exist in the users bag if they do it will create a second object that will increase the ammount of consumable items
            if (itemIdCheck.length > 0 || itemIdCheck.includes(id) ) {
                const item = {
                    id,
                    name,
                    category,
                    equipable
                }
                toUpload.itemUpdateData.push(item)
                i++
            } else {
                const item = {
                    id,
                    name,
                    category,
                    effects,
                    equipable
                }
                toUpload.itemDropData.push(item)
                i++
            }
        } while (i < itemsToDrop.length)
        return toUpload
    }
    //uploads the objects to the database
    const itemUploader = async (toUpload) => {
        if (toUpload.itemDropData.length > 0 && toUpload.itemUpdateData.length <= 4) {
            let n = 0
            do {
                if (toUpload.itemDropData[n].category == 'armor') {
                    const itemToGive = {
                        id: toUpload.itemDropData[n].id,
                        name: toUpload.itemDropData[n].name,
                        category: toUpload.itemDropData[n].category,
                        effects: toUpload.itemDropData[n].effects,
                        equipable: toUpload.itemDropData[n].equipable,
                        equiped: false
                    }
                    await User.findByIdAndUpdate({ _id: userId }, {
                        $push: {
                            bag: itemToGive
                        }
                    })
                } else if (toUpload.itemDropData[n].category == 'consumable') {
                    const itemToGive = {
                        id: toUpload.itemDropData[n].id,
                        name: toUpload.itemDropData[n].name,
                        category: toUpload.itemDropData[n].category,
                        effects: toUpload.itemDropData[n].effects,
                        equipable: toUpload.itemDropData[n].equipable,
                        quantity: 1
                    }
                    await User.findByIdAndUpdate({ _id: userId }, {
                        $push: {
                            bag: itemToGive
                        }
                    })
                } else if (toUpload.itemDropData[n].category == 'keyItems') {
                    console.log(toUpload.itemDropData[n].name)
                }
                n++
            } while (n < toUpload.itemDropData.length)
            if(toUpload.itemUpdateData.length < 1) return
            i = 0
            do {
                if (!toUpload.itemUpdateData[i].equipable) {
                    let { bag } = await User.findById({
                        _id: userId
                    })
                    const bagObj = Object.values(bag)
                    const indexOfItem = bagObj.findIndex(n => n.id == toUpload.itemUpdateData[i].id)
                    bag[indexOfItem].quantity += 1
                    await User.findByIdAndUpdate({ _id: userId }, {
                        bag
                    })
                }
                i++
            } while (i < toUpload.itemUpdateData.length)
            return true
        } else if (toUpload.itemDropData.length < 1 && toUpload.itemUpdateData.length <= 4) {
            i = 0
            do {
                if (!toUpload.itemUpdateData[i].equipable) {
                    let { bag } = await User.findById({
                        _id: userId
                    })
                    const bagObj = Object.values(bag)
                    const indexOfItem = bagObj.findIndex(n => n.id == toUpload.itemUpdateData[i].id)
                    bag[indexOfItem].quantity += 1
                    await User.findByIdAndUpdate({ _id: userId }, {
                        bag
                    })
                }
                i++
            } while (i < toUpload.itemUpdateData.length)
            return true
        }
    }

    const toUpload = await itemsToUpload(itemsToDrop)
    
    return await itemUploader(toUpload)
}

//grabs the ID's of all the items the user has in his bag
async function itemIdChecker(userId) {
    const { bag } = await User.findById({ _id: userId })
    if (bag.length < 1) return bag
    const bagCheck = Object.values(bag).map((item) => {
        const id = item.id
        return id
    })
    return bagCheck
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
            equiped: typeof bagToSort[i].equiped == 'undefined' ? null : bagToSort[i].equiped
        }
        sortedBag.push(itemsInBag)
        i++
    } while (i < bagToSort.length)
    console.log(sortedBag)
    return sortedBag
}

module.exports = { itemGiver, itemIdChecker, bagSorter }

