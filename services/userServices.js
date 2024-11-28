const {saveUser, findUser} = require('../db/db')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const errorTemplate = require("../templates/errorTemplate")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

exports.RegisterUser = async (req, res) => {
    try {
        const user = await findUser({email: req.body.email})

        if(user) {
            throw new Error('User exist, try logging in')
        } else {
            if(user) {
                throw new Error('User exist, try logging in')
            } else {
                const user = new User();
                user._id = new mongoose.Types.ObjectId()
                const newUser = Object.assign(user, req.body)
                // Encrypt the password
                const hash = await bcrypt.hash(newUser.password, 10)
                // Set date start
                const date = new Date()
                newUser.datestart = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                // Set the password with the encrypted password
                newUser.password = hash
                const savedUser = await saveUser(newUser)
                return res.status(201).json({
                    message: "Successful Registration", 
                    user: user
                    })
                }
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
            throw new Error('Authentication Failed: Unable to find user')
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
                    message: 'Login Successful'
                })
            } else {
                // Return response authentication failed
                throw new Error('Authentication failed: Email or password does not match')
            }
        }
    } catch (err) {
        return errorTemplate(res, err, err.message, 501)
    }

}   



