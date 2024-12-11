const express = require('express')
const router = express.Router()
const {RegisterUser, LoginUser, ForgotPassword} = require('../services/userServices')

router.post('/register', RegisterUser)
router.post('/login', LoginUser)
router.post('/forgotpassword', ForgotPassword)

module.exports = router