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

const authAdmin = (req, res, next) => {
    try {
        const [, token] = req.headers.authorization.split(' ')
        const decode = jwt.verify(token, process.env.jwt_secret)
        if(decode.user.role == 'admin') {
            next()
        } else {
            new Error(messages.AUTH_ADMIN_FAILED)
        }
    } catch(err) {
        errorTemplate(res, err, messages.AUTH_FAILED, 500)
    }
}

module.exports = {auth, authAdmin}