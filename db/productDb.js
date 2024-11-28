const Product = require('../models/productModel')

const findProducts = async (obj, selectValues) => {
    return await Product.find(obj).select(selectValues).exec()
}

const findProduct = async (obj, selectValues) => {
    return await Product.findOne(obj).select(selectValues).exec()
}

const saveProduct = async (newProduct) => {
    return await newProduct.save()
}

const updateProduct = async (filter, update) => {
    return await Product.updateOne(filter, update, {new: true}).exec()
}

const deleteProduct = async (obj) => {
    return await Product.deleteOne(obj).exec()
}

module.exports = {findProducts, findProduct, saveProduct, updateProduct, deleteProduct}