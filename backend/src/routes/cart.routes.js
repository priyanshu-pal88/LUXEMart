const express = require('express');
const { getCartProducts, addToCart, removeFromCart, decreaseCartquantity } = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/authMiddleware');


const cartRouter = express.Router()

cartRouter.get('/',authMiddleware, getCartProducts)
cartRouter.post('/add-to-cart', authMiddleware,addToCart )
cartRouter.post('/remove-cart',authMiddleware,removeFromCart)
cartRouter.post('/decrease-cart',authMiddleware,decreaseCartquantity)

module.exports = cartRouter