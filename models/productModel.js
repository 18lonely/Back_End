const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productArea: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: false
    },
    productAddress: {
        type: String,
        required: false
    },
    productCity: {
        type: String,
        required: false
    },
    productPrice: {
        type: String,
        required: true
    },
    productStatus: {
        type: String,
        required: false
    },
    productImg: {
        data: Buffer,
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)