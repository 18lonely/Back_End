const {saveUser, findUser, findUsers, deleteUser, updateUser} = require('../db/userDb')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const errorTemplate = require("../templates/errorTemplate")
const successTemplate = require("../templates/successTemplate")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const messages = require('../messages/messages')
const { GeneratePassword } = require('../utils/utils')
const sendMail = require('../utils/tranposter')
require('dotenv').config()

exports.ForgotPassword = async (req, res) => {
    try {
        let email = req.body.email
        const userFound = await findUser({email: req.body.email})

        if(!userFound) {
            throw new Error(messages.UNABLE_TO_FIND_USER)
        } else {
            const newPassword = GeneratePassword()
            sendMail(userFound.email, "Quên mật khẩu", 'Mật khẩu mới: ' + newPassword)

            const hash = await bcrypt.hash(newPassword, 10)
            userFound.password = hash

            const result = await updateUser({_id: userFound._id}, userFound)

            return successTemplate(res, result, messages.FORGOTPASSWORD_SUCCESSFUL, 200)
        }
    } catch(err) {
        return errorTemplate(res, err, err.message, 500)
    }
}

exports.GetUserById = async (req, res) => {
    try {
        const user = await findUser({_id: req.params.id}, '-__v')
        if(user) {
            console.log(user)
            user.password = ''
            return res.status(200).json({
                message: messages.SUCCESSFUL_GET_USER_BY_ID  + ': ' + req.params.id,
                user: user
            })
        } else {
            throw new Error(messages.UNABLE_TO_FIND_USER)
        }
    } catch (err) {
        return errorTemplate(res, err, err.message, 500)
    }
}

exports.GetAllUser = async (req, res) => {
    try {

        const page = parseInt(req.params.page) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const users = await findUsers({role: req.body.role}, '-__v', skip, limit)

        const totalUser = await User.countDocuments({ role: req.body.role })
        const totalPage = Math.ceil(totalUser / limit)

        return res.status(200).json({
            message: messages.SUCCESSFUL_GET_ALL_USER_BY + "Role: " + req.body.role,
            users: users,
            page: page,
            totalPage: totalPage
        })
    } catch(err) {
        return errorTemplate(res, err, err.message, 500)
    }
}

exports.RegisterUser = async (req, res) => {
    try {
        const user = await findUser({email: req.body.email})
        if(user) {
            throw new Error(messages.USER_EXIST)
        } else {
            const user = new User();
            user._id = new mongoose.Types.ObjectId()
            const newUser = Object.assign(user, req.body)
            // Encrypt the password
            const hash = await bcrypt.hash(newUser.password, 10)
            
            if(req.headers.authorization) {
                const [, token] = req.headers.authorization.split(' ')
                const decode = jwt.verify(token, process.env.jwt_secret)
                const isAdmin = decode.user.role == 'admin' ? true : false
                if(!isAdmin) {
                    newUser.role = 'user'
                } 
            } else {
                newUser.role = 'user'
            }

            // Set date start
            const date = new Date()
            newUser.datestart = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            // Set the password with the encrypted password
            newUser.password = hash
            const savedUser = await saveUser(newUser)
            return res.status(201).json({
                message: messages.USER_SUCCESSFUL_REGISTER, 
                user: user
                })
            }
    
    } catch(err) {
        return errorTemplate(res, err, err.message, 501)
    }
}

exports.LoginUser = async (req, res) => {
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
                // create a JSON Web Token
                const token = jwt.sign({user: loggedUser}, process.env.jwt_secret)
                // Return response stating authentication successful, token, logged:true
                return res.status(201).json({
                    user: loggedUser,
                    logged: true,
                    token: token,
                    message: messages.USER_LOGIN_SUCCESSFUL
                })
            } else {
                // Return response authentication failed
                throw new Error(messages.EMAIL_PASSWORD_DOES_NOT_MATCH)
            }
        }
    } catch (err) {
        return errorTemplate(res, err, err.message, 501)
    }

}   

exports.DeleteUser = async (req, res) => {
    try {
        const id = req.params.userId
        const result = await deleteUser({_id: id})
        return successTemplate(res, result, messages.USER_DELETED, 200)
    } catch(err) {
        return errorTemplate(res, err, messages.USER_NOT_DELETED, 500)
    }
}

exports.UpdateUser = async (req, res) => {
    try {
        const id = req.params.userId

        const userFound = await findUser({_id: id}, '-__v')
        const userFoundE = await findUser({email: req.body.email})

        if(userFoundE && userFound._id.toString() != userFoundE._id.toString()) {
            throw new Error(messages.EMAIL_EXIST)
        }

        const [, token] = req.headers.authorization.split(' ')
        const decode = jwt.verify(token, process.env.jwt_secret)
        const isAdmin = decode.user.role == 'admin' ? true : false

        if(isAdmin || decode.user._id == userFound._id) {
            const user = new User()

            const newUser = Object.assign(user, req.body)

            if(newUser.password != "undefined" && newUser.password != "") {
                const hash = await bcrypt.hash(newUser.password, 10)
                newUser.password = hash
            } else {
                newUser.password = userFound.password
            }
            
            const result = await updateUser({_id: id}, newUser)

            return successTemplate(res, result, messages.USER_UPDATED, 200)
        } else {
            throw new Error(messages.PERMISSION_DENIED)
        }
        
    } catch(err) {
        return errorTemplate(res, err, err.message, 500)
    }
}



