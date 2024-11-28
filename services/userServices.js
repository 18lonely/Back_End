const {saveUser, findUser, findUsers, deleteUser, updateUser} = require('../db/userDb')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const errorTemplate = require("../templates/errorTemplate")
const successTemplate = require("../templates/successTemplate")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const messages = require('../messages/messages')
require('dotenv').config()

exports.GetAllUser = async (req, res) => {
    try {
        const users = await findUsers({role: req.body.role}, '-__v')

        return res.status(200).json({
            message: messages.SUCCESSFUL_GET_ALL_USER_BY + "Role: " + req.body.role,
            users: users
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
                const isAdmin = decode.user.role
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
        console.log(id)
        const result = await deleteUser({_id: id})
        return successTemplate(res, result, messages.USER_DELETED, 200)
    } catch(err) {
        return errorTemplate(res, err, messages.USER_NOT_DELETED, 500)
    }
}

exports.UpdateUser = async (req, res) => {
    try {
        const id = req.params.userId
        const user = new User()

        const update = Object.assign(user, req.body)
        const result = await updateUser({_id: id}, update)

        return successTemplate(res, result, messages.USER_UPDATED, 200)
    } catch(err) {
        console.log(err)
        return errorTemplate(res, err, messages.USER_NOT_UPDATED, 500)
    }
}



