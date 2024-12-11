const express = require('express')
const router = express.Router()
const {getAllProductByUserId, getAllProducts, GetProductById, PostProduct, UpdateProduct, DeleteProduct, SearchProducts} = require('../services/productService')
const {auth} = require('../auth/authorization')

// http://localhost:3000/products
router.get('/getall/:page', getAllProducts)

// http://localhost:3000/products/{{productId}}
router.get('/:productId', GetProductById)

// http://localhost:3000/products/
router.post('/', auth, PostProduct)

// http://localhost:3000/products/{{productId}}
router.put('/:productId', auth, UpdateProduct)

// http://localhost:3000/products/{{productId}}
router.delete('/:productId', auth, DeleteProduct)

// http://localhost:3000/products/user/{{userid}}
router.get('/user/:userid/:page', auth, getAllProductByUserId)

router.get('/search/:key/:page', SearchProducts)

module.exports = router