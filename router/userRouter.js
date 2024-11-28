const express = require('express')
const router = express.Router()
const {RegisterUser, LoginUser} = require('../services/userServices')

router.post('/register', RegisterUser)

router.post('/login', LoginUser)

module.exports = router