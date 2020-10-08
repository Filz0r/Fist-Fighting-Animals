const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    effects: {
        type: Object,
        required: false
    },
    cost:  {
        type: Number,
        required: false
    },
    equipable: {
        type: Boolean,
        required: false
    }
})

module.exports = mongoose.model('items', itemSchema)