const express = require("express")
const cors = require('cors')
const adminRouter = require('../router/adminRouter')
const userRouter = require('../router/userRouter')
const productRouter = require('../router/productRouter')
const {connect} = require('../db/db')
const app = express()
// Use middleware to from our contract for incoming json payloads ONLY!!
app.use(express.json())
// Use middleware for url encoding
app.use(express.urlencoded({extended: true}))
// Use middleware to handle cors policy
app.use(cors())

// Health point or actuator
// http://localhost:3000
app.get('/', (req, res, next) => {
    res.status(200).json({message: "Service is up"})
})

// Router
// http://localhost:3000/admin
app.use('/admin', adminRouter)

// Router
// http://localhost:3000/users
app.use('/users', userRouter)

// Router
// http://localhost:3000/products
app.use('/products', productRouter)

// Bad url or error we can handle
// With middleware
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json(
        {
            error: {
                message: error.message,
                status: error.status
            }
        }
    )
})

// Connect database
connect()

module.exports = app