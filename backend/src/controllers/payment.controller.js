require('dotenv').config();
const Razorpay = require('razorpay');
const productModel = require('../models/product.model');
const cartModel = require('../models/cart.model');
const paymentModel = require('../models/payment.model');
const PDFDocument = require('pdfkit');
const path = require('path');

const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createOrder(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'User not authenticated' });

    // Fetch user's cart with populated product details
    const cart = await cartModel.findOne({ userId: user._id }).populate('products.productId');
    
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount in paise
    let totalAmount = 0;
    for (const item of cart.products) {
      const product = item.productId;
      if (!product || !product.price || !product.price.amount) {
        return res.status(400).json({ message: 'Invalid product in cart' });
      }
      const itemTotal = Number(product.price.amount) * item.quantity;
      totalAmount += itemTotal;
    }

    // Convert rupees to paise
    const amountInPaise = Math.round(totalAmount * 100);

    const options = {
      amount: amountInPaise, // in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const newPayment = await paymentModel.create({
      orderId: order.id,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
      currency: order.currency,
      status: 'PENDING',
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
}
async function verifyPayment(req, res) {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body || {}
  if (!razorpayOrderId || !razorpayPaymentId || !signature) {
    return res.status(400).json({ message: 'razorpayOrderId, razorpayPaymentId and signature are required' })
  }
  try {
    const result = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      process.env.RAZORPAY_KEY_SECRET
    )
    if (!result) return res.status(400).json({ message: 'Invalid signature' })

    const payment = await paymentModel.findOne({ orderId: razorpayOrderId })
    if (!payment) return res.status(404).json({ message: 'Payment not found for order' })

    payment.paymentId = razorpayPaymentId
    payment.signature = signature
    payment.status = 'COMPLETED'
    await payment.save()
    res.json({ status: 'success',
      paymentId: razorpayPaymentId,
     })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error verifying payment')
  }
}

async function generateReceipt(req, res) {
  try {
    const { paymentId } = req.params;
    const payment = await paymentModel.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const doc = new PDFDocument();
    const filename = `receipt_${paymentId}.pdf`;

    // Set headers for browser download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // ---------------- PDF DESIGN ----------------
    doc.fontSize(22).text('PAYMENT RECEIPT', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Order ID   : ${payment.orderId}`);
    doc.text(`Payment ID : ${payment.paymentId}`);
    doc.text(`Amount     : ₹${payment.price.amount / 100}`);
    doc.text(`Status     : ${payment.status}`);
    doc.text(`Currency   : ${payment.price.currency}`);
    doc.text(`Date       : ${new Date(payment.createdAt).toLocaleString()}`);

    doc.moveDown();
    doc.text('Thank you for your purchase!', { align: 'center' });

    // Close PDF
    doc.end();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error generating receipt PDF' });
  }
}

module.exports = { createOrder,verifyPayment,generateReceipt };