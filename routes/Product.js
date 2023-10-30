const router = require('express').Router()
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken')
const Product = require('../models/Product')
const CryptoJS = require("crypto-js");




//CREATE 
// in this case we are supposing that only admin can create the product
router.post('/', verifyTokenAndAdmin, async (req, res) => {

    const newProduct = new Product(req.body)

    try {

        const savedProduct = await newProduct.save()
        res.json(savedProduct)

    } catch (error) {
        res.status(500).json(error)
    }


})


//Updating Existing categories; - Only admin can update the product catalogue

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {

    const productId = req.params.id

    try {

        const updatedProducts = await Product.findOneAndUpdate({ _id: productId }, {
            $set: req.body
        },
            { new: true })

        res.json(updatedProducts)

    } catch (error) {
        res.status(500).json(error)
    }

})

//DELETE THE PRODUCT

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {

    const productId = req.params.id

    try {
        await Product.findByIdAndDelete(productId)

        res.status(200).json('Product Deleted Successfully')
    } catch (error) {
        res.status(401).json(error)
    }

})

//Get Particular Product

router.get('/find/:id', async (req, res) => {
    const productId = req.params.id

    try {

        const product = await Product.findById(productId)

        res.json(product)

    } catch (error) {
        res.status(401).json(error)

    }
})

//Get All Products:

router.get('/find', async (req, res) => {

    try {

        const allProducts = await Product.find()
        res.json(allProducts)

    } catch (error) {
        res.status(401).json(error)

    }
})


//Get All Products By Particlar Category or get all products based on the param we passed the query to the URL

router.get('/', async (req, res) => {

    const qNew = req.query.new;
    const qCategories = req.query.category

    try {

        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5)
        } else if (qCategories) {
            products = await Product.find({
                categories: {
                    $in: [qCategories]
                }
            })
        } else {
            products = await Product.find()
        }

        res.json(products)

    } catch (error) {
        res.status(401).json(error)

    }

})




module.exports = router