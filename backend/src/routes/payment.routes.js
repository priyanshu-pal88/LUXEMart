const express = require('express');
const { createOrder, verifyPayment, generateReceipt } = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const paymentRouter = express.Router()

// Create order for entire cart (requires authentication)
paymentRouter.post('/create-order', authMiddleware, createOrder)
// Verify a completed payment
paymentRouter.post('/verify', verifyPayment)
paymentRouter.get('/receipt/:paymentId', generateReceipt)

module.exports = paymentRouter;