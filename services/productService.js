const mongoose = require('mongoose')
const messages = require('../messages/messages')
const errorTemplate = require('../templates/errorTemplate')
const successTemplate = require('../templates/successTemplate')
const {findProducts, findProduct, saveProduct, updateProduct, deleteProduct, searchProducts} = require('../db/productDb')
const Product = require('../models/productModel')
require('dotenv').config()
const jwt = require('jsonwebtoken')

exports.getAllProducts = async(req, res) => {
    try {
        const page = parseInt(req.params.page) || 1
        const limit = 10
        const skip = (page - 1) * limit
        const products = await findProducts({}, skip, limit, '-__v')
        const totalProducts = await Product.countDocuments()
        const totalPage = Math.ceil(totalProducts / limit)

        return res.status(200).json({
            message: "Succesful Products",
            products: products,
            page: page,
            totalProducts: totalProducts,
            limit: limit,
            totalPage: totalPage
        })
    } catch(err) {
        return errorTemplate(res, err, err.message, 500)
    }
}

exports.GetProductById = async (req, res) => {
    try {
        const product = await findProduct({_id: req.params.productId}, '-__v')
        
        if(!product) {
            throw new Error(messages.PRODUCT_NOT_FOUND)
        } else {
            successTemplate(res, product, messages.PRODUCT_FOUND, 200)
        }
    } catch(err) {
        return errorTemplate(res, err, err.message, 501)
    }
}

exports.PostProduct = async (req, res) => {
    try {
        const product = new Product()
        const foundProduct = Object.assign(product, req.body)

        const productF = await findProduct(foundProduct)

        if(productF) {
            throw new Error(messages.PRODUCT_CATALOGED)
        } else {
            let newProduct = new Product()
            newProduct._id = new mongoose.Types.ObjectId()
            newProduct = Object.assign(newProduct, req.body)

            const [, token] = req.headers.authorization.split(' ')
            const decode = jwt.verify(token, process.env.jwt_secret)
            newProduct.user = decode.user

            const savedProduct = await saveProduct(newProduct)

            return successTemplate(res, savedProduct, messages.PRODUCT_SAVED, 201)
        }
    } catch(err) {
        return errorTemplate(res, err, err.message, 501)
    }
}

exports.UpdateProduct = async (req, res) => {
    try {
        const id = req.params.productId

        const productFound = await findProduct({_id: id}, '-__v')

        if(!productFound) {
            throw new Error(messages.PRODUCT_NOT_FOUND)
        }

        // Check if product belongs to user or admin
        const [, token] = req.headers.authorization.split(' ')
        const decode = jwt.verify(token, process.env.jwt_secret)
        const isAdmin = decode.user.role == 'admin' ? true : false

        if(isAdmin || decode.user._id == productFound.user) {
            const product = new Product()

            const newProduct = Object.assign(product, req.body)
    
            const result = await updateProduct({_id: id}, newProduct)

            return successTemplate(res, result, messages.PRODUCT_UPDATED, 200)
        } else {
            throw new Error(messages.PERMISSION_DENIED)
        }
    } catch(err) {
        return errorTemplate(res, err, messages.PRODUCT_NOT_UPDATED, 500)
    }
}

exports.DeleteProduct = async (req, res) => {
    try {
        const id = req.params.productId

        const productFound = await findProduct({_id: id}, '-__v')

        if(!productFound) {
            throw new Error(messages.PRODUCT_NOT_FOUND)
        }

        // Check if product belongs to user or admin
        const [, token] = req.headers.authorization.split(' ')
        const decode = jwt.verify(token, process.env.jwt_secret)
        const isAdmin = decode.user.role == 'admin' ? true : false

        if(isAdmin || decode.user._id == productFound.user) {
            const result = await deleteProduct({_id: id})
            return successTemplate(res, result, messages.PRODUCT_DELETED, 200)
        } else {
            throw new Error(messages.PERMISSION_DENIED)
        }
    } catch(err) {
        return errorTemplate(res, err, messages.PRODUCT_NOT_DELETED, 500)
    }
}

exports.getAllProductByUserId = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1
        const limit = 10
        const skip = (page - 1) * limit
        const products = await findProducts({user: req.params.userid}, skip, limit, '-__v')
        const totalProducts = await Product.countDocuments({user: req.params.userid})
        const totalPage = Math.ceil(totalProducts / limit)
        
        return res.status(200).json({
            message: "Succesful Products",
            products: products,
            page: page,
            totalProducts: totalProducts,
            limit: limit,
            totalPage: totalPage
        })
    } catch(err) {
        return errorTemplate(res, err, err.message, 500)
    }
}

exports.SearchProducts = async (req, res) => {
    try {
        const keyword = req.params.key
        const page = parseInt(req.params.page) || 1
        const limit = 10
        const skip = (page - 1) * limit
        const products = await searchProducts(keyword, skip, limit, '-__v')
        const totalProducts = await Product.countDocuments({
            $or: [
                { productName: { $regex: keyword, $options: 'i' } },
                { productCity: { $regex: keyword, $options: 'i' } }
            ]
        })
        const totalPage = Math.ceil(totalProducts / limit)

        return res.status(200).json({
            message: "Succesful Products",
            products: products,
            page: page,
            totalProducts: totalProducts,
            limit: limit,
            totalPage: totalPage
        })

    } catch(err) {
        return errorTemplate(res, err, err.message, 500)
    }
}
