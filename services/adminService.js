const messages = require('../messages/messages')
const successTemplate = require('../templates/successTemplate')
const errorTemplate = require('../templates/errorTemplate')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {findUser} = require('../db/userDb')

const AdminLogin = async (req, res) => {
    try {
        // Find the user return a new user
        const loggedUser = await findUser({email: req.body.email})

        // If the user NOT found
        // Return response stating authentication failed
        if(!loggedUser) {
            throw new Error(messages.UNABLE_TO_FIND_USER)
        } else {
            // Use bcrypt to compare passwords
            const result = await bcrypt.compare(req.body.password, loggedUser.password)
            
            if(result) {
                if(loggedUser.role == 'user') {
                    throw new Error(messages.ADMIN_ONLY)
                } else {
                    // create a JSON Web Token
                    const token = jwt.sign({user: loggedUser}, process.env.jwt_secret)
                    // Return response stating authentication successful, token, logged:true
                    return res.status(201).json({
                        user: loggedUser,
                        logged: true,
                        token: token,
                        message: messages.USER_LOGIN_SUCCESSFUL
                    })
                }
            } else {
                // Return response authentication failed
                throw new Error(messages.EMAIL_PASSWORD_DOES_NOT_MATCH)
            }
        }
    } catch (err) {
        return errorTemplate(res, err, err.message, 501)
    }
}

module.exports = {AdminLogin}