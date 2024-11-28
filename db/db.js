require('dotenv').config()
const mongoose = require('mongoose')

const connect = async () => {
    mongoose.connect(process.env.mongoose)
        .then(() => console.log('MongoDB is up and running!'))
}

const disconnect = async () => {
    console.log('Disconnceted!')
    mongoose.disconnect()
}

module.exports = {connect, disconnect}