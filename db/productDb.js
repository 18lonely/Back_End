const Product = require('../models/productModel')

const findProducts = async (obj, skip, limit) => {
    return await Product.find(obj).sort({ productName: 1 }).skip(skip).limit(limit).exec()
    // return await Product.find(obj).select(selectValues).exec()
}

const searchProducts = async (key, skip, limit) => {
    return await Product.find({
        $or: [
            { productName: { $regex: key, $options: 'i' } },
            { productCity: { $regex: key, $options: 'i' } }
        ]
    }).sort({ productName: 1 }).skip(skip).limit(limit).exec()
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
    return await Product.findOneAndDelete(obj).exec()
}

module.exports = {searchProducts, findProducts, findProduct, saveProduct, updateProduct, deleteProduct}