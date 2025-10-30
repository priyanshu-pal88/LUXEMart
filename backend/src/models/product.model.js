const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { amount: { type: Number, min: 0, required: true }, currency: { type: String, default: "INR", enum: ["USD", "INR"], required: true } },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    images: { type: String, required: true },
},
    { timestamps: true }
);

const productModel = mongoose.model('products', productSchema);


module.exports = productModel