const mongoose = require('mongoose')


const reqString = {
    type: String,
    required: false
}
const userSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required : true
    },
    username: reqString,
    email: reqString,
    password: reqString,
    admin: {
        type: Boolean,
        required: true,
    }
})

module.exports = mongoose.model('users', userSchema)