const express = require('express');
const authRouter = require('./routes/auth.routes');
const productRouter = require('./routes/products.routes');
const cartRouter = require('./routes/cart.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const paymentRouter = require('./routes/payment.routes');


const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://luxe-mart-phi.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
}))
app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use('/api/payments',paymentRouter)


module.exports = app;