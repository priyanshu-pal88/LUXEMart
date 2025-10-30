const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { createProduct, getProducts,  getCategoryProduct, bulkUploadProducts, getFeaturedProducts } = require('../controllers/products.controller')



const productRouter = express.Router()

productRouter.get('/',authMiddleware,getProducts )
productRouter.get('/featured',authMiddleware,getFeaturedProducts )
productRouter.post('/create-item', createProduct )
productRouter.get('/get-item/:category',authMiddleware,getCategoryProduct )
productRouter.patch('/update-item/:id',authMiddleware, )
productRouter.post('/bulk',bulkUploadProducts)

module.exports = productRouter