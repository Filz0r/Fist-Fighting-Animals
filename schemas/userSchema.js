const mongoose = require('mongoose')


const reqString = {
    type: String,
    required: true
}
const reqNumber = {
    type: Number,
    required: true
}
const userSchema = new mongoose.Schema({
    _id: reqNumber,
    username: reqString,
    email: reqString,
    password: reqString,
    joinDate: {
        type: Date,
        default: Date.now,
    },
    admin: {
        type: Boolean,
        required: true,
    },
    level: reqNumber,
    attack: reqNumber,
    defense: reqNumber,
    currentHp: reqNumber,
    maxHp: reqNumber,
    storyLvl: reqNumber,
    pointsToAdd: reqNumber,
    coins: {
        type: Number,
        required: false
    },
    storyCounter: {
        type: Number,
        required: false
    },
    new: {
        type: Boolean,
        required: false    
    },
    bag: {
        type: Array,
        required: false
    },
    armor: {
        type: Object,
        required: false
    },
    consumableCounter : {
        type: Number,
        required: false
    },
    consumableEffects: { 
        type: Object,
        required: false
    }

})

module.exports = mongoose.model('users', userSchema)