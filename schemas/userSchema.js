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
    HP: reqNumber,
    storyLvl: reqNumber,
    pointsToAdd: reqNumber,

})

module.exports = mongoose.model('users', userSchema)