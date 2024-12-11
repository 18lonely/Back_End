const User = require('../models/userModel')

const findUsers = async (obj, selectValues, skip, limit) => {
    return await User.find(obj).select(selectValues).sort({ username: 1 }).skip(skip).limit(limit).exec()
}

const updateUser = async (filter, update) => {
    return await User.updateOne(filter, update, {new: true}).exec()
}

const deleteUser = async (obj) => {
    return await User.deleteOne(obj).exec()
}

// Obj {firstName: req.body.firstName, email: req.body.email}
const findUser = async (obj) => {
    return User.findOne(obj)
}

const saveUser = async (newUser) => {
    return await newUser.save()
}

module.exports = {findUser, saveUser, findUsers, updateUser, deleteUser}