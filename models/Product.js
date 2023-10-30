const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true},
        desc: { type: String, required: true },
        img: { type: String, required: true },
        categories: { type: Array}, //choosing array for muliple categories
        size: { type: Array },
        color: { type: Array},
        price: { type: Number, required: true },
        inStock : {type: Boolean, default: true}
    },
    {timestamps: true}
)

const ProductModel = mongoose.model('Product', ProductSchema)

module.exports = ProductModel