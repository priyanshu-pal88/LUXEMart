const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
        quantity: { type: Number, default: 1, min: 1 }
    }]
}, { timestamps: true });
const cartModel = mongoose.model('carts', cartSchema);

module.exports = cartModel;