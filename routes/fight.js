const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../controllers/AuthController')
const User = require('../schemas/userSchema')

router.get('/', checkAuthenticated, async (req, res) => {
        
})

module.exports= router