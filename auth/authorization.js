require('dotenv').config()
const jwt = require('jsonwebtoken')
const errorTemplate = require('../templates/errorTemplate')
const messages = require('../messages/messages')

const auth = (req, res, next) => {
    try {
        // Bearer: .......
        const [, token] = req.headers.authorization.split(' ')
        jwt.verify(token, process.env.jwt_secret)
        next()
    } catch(err) {
        errorTemplate(res, err, messages.AUTH_FAILED, 500)
    }
}

module.exports = {auth}