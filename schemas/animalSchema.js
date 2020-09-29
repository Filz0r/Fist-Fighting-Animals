const mongoose = require('mongoose')


const reqString = {
    type: String,
    required: true
}
const reqNumber = {
    type: Number,
    required: true
}
const animalSchema = new mongoose.Schema({
    _id: reqNumber,
    name: reqString,
    category: reqString,
    level: reqNumber,
    attack: reqNumber,
    defense: reqNumber,
    HP: reqNumber,
    img_path: reqString,
    storyLvl: reqNumber,
    pointsToAdd: reqNumber,
    coinsDrop: reqNumber,
})

module.exports = mongoose.model('animals', animalSchema)