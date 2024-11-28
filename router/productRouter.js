const express = require('express')
const router = express.Router()
const {getAllProducts, GetProductById, PostProduct, UpdateProduct, DeleteProduct} = require('../services/productService')
const {auth} = require('../auth/authorization')

// http://localhost:3000/products
router.get('/', auth, getAllProducts)

// http://localhost:3000/products/{{productId}}
router.get('/:productId', auth, GetProductById)

// http://localhost:3000/products/
router.post('/', auth, PostProduct)

// http://localhost:3000/products/{{productId}}
router.put('/:productId', auth, UpdateProduct)

// http://localhost:3000/products/{{productId}}
router.delete('/:productId', auth, DeleteProduct)

module.exports = router