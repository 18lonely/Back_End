const express = require('express')
const router = express.Router()

const {authAdmin} = require('../auth/authorization')
const { GetAllUser, RegisterUser, DeleteUser, UpdateUser } = require('../services/userServices')

// Get all user, add, delete, edit
// Get all user
// http://localhost:3000/admin/users/
router.get('/users/', authAdmin, GetAllUser)
// Add user with role user or admin
// http://localhost:3000/admin/users/
router.post('/users/', authAdmin, RegisterUser)

// Delete user by ID
// http://localhost:3000/admin/users/{{userId}}
router.delete('/users/:userId', authAdmin, DeleteUser)

// Update user by ID
// http://localhost:3000/admin/users/{{userId}}
router.put('/users/:userId', authAdmin, UpdateUser)

// Get all product, add, delete, edit

module.exports = router
