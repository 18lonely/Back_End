require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/userModel')

const connect = async () => {
    mongoose.connect(process.env.mongoose)
        .then(() => console.log('MongoDB is up and running!'))
}

const disconnect = async () => {
    console.log('Disconnceted!')
    mongoose.disconnect()
}

// Obj {firstName: req.body.firstName, email: req.body.email}
const findUser = async (obj) => {
    return User.findOne(obj)
}

const saveUser = async (newUser) => {
    return await newUser.save()
}

module.exports = {connect, disconnect, findUser, saveUser}