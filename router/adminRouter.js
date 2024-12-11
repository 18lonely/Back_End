const express = require('express')
const router = express.Router()

const {authAdmin, auth} = require('../auth/authorization')
const { GetAllUser, RegisterUser, DeleteUser, UpdateUser, GetUserById } = require('../services/userServices')
const {AdminLogin} = require('../services/adminService')

router.post('/users/', AdminLogin)

// Get all user, add, delete, edit

// Get user by id
router.get('/users/:id', GetUserById)
// Get all user by role
// http://localhost:3000/admin/users/role
router.post('/users/role/:page', authAdmin, GetAllUser)
// Add user with role user or admin
// http://localhost:3000/admin/users/
router.post('/users/', authAdmin, RegisterUser)

// Delete user by ID
// http://localhost:3000/admin/users/{{userId}}
router.delete('/users/:userId', authAdmin, DeleteUser)

// Update user by ID
// http://localhost:3000/admin/users/{{userId}}
router.put('/users/:userId', auth, UpdateUser)

module.exports = router
