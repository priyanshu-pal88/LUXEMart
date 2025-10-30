const cartModel = require("../models/cart.model");


async function getCartProducts(req, res) {
    const user = req.user
    try {
        const cartProducts = await cartModel.find({ userId: user._id }).populate("products.productId")
        return res.status(200).json({ message: "Cart products fetched successfully", cartProducts })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function addToCart(req, res) {
    const user = req.user
    const { productId, quantity } = req.body
    const MAX_QUANTITY_PER_PRODUCT = 5;
    
    try {
        let cart = await cartModel.findOne({ userId: user._id })
        if (!cart) {
            // Check if initial quantity exceeds limit
            if (quantity > MAX_QUANTITY_PER_PRODUCT) {
                return res.status(400).json({ 
                    message: `Maximum quantity allowed per product is ${MAX_QUANTITY_PER_PRODUCT}` 
                });
            }
            cart = await cartModel.create({
                userId: user._id,
                products: [{ productId, quantity }]
            })

        }
        else {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex > -1) {
                const newQuantity = cart.products[productIndex].quantity + quantity;
                
                // Check if new quantity exceeds limit
                if (newQuantity > MAX_QUANTITY_PER_PRODUCT) {
                    return res.status(400).json({ 
                        message: `Maximum quantity allowed per product is ${MAX_QUANTITY_PER_PRODUCT}. Current quantity: ${cart.products[productIndex].quantity}` 
                    });
                }
                cart.products[productIndex].quantity = newQuantity;
                
            }
            else {
                // Check if initial quantity exceeds limit
                if (quantity > MAX_QUANTITY_PER_PRODUCT) {
                    return res.status(400).json({ 
                        message: `Maximum quantity allowed per product is ${MAX_QUANTITY_PER_PRODUCT}` 
                    });
                }
                cart.products.push({ productId, quantity })
            }
        }
        await cart.save()
        await cart.populate("products.productId")
        return res.status(200).json({ message: "Product added to cart successfully", cart  })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }


}

async function removeFromCart(req, res) {
    try {
        const { productId } = req.body
        const user = req.user
        const cart = await cartModel.findOne({ userId: user._id })
        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId)
        if (itemIndex > -1) {
            cart.products.splice(itemIndex, 1)
        }
        await cart.save()
        await cart.populate("products.productId")
        
        return res.status(200).json({ message: "Product removed from cart successfully", cart })
    }
    catch (err) {
        return res.status(500).json({ message: "Error in removing the cart product" });
    }
}

async function decreaseCartquantity(req, res) {
    try {
        const { productId } = req.body
        const user = req.user
        const cart = await cartModel.findOne({ userId: user._id })
        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId)
        if (itemIndex > -1) {
            if (cart.products[itemIndex].quantity > 1) {
                cart.products[itemIndex].quantity -= 1
            }
            else {
                cart.products.splice(itemIndex, 1)
            }
        }
        await cart.save()
        await cart.populate("products.productId")
        return res.status(200).json({ message: "Cart product quantity decreased successfully", cart })
    }
    catch (err) {
        return res.status(500).json({ message: "Cannot decrease the quantity" })

    }
}
module.exports = {
    getCartProducts,
    addToCart,
    removeFromCart,
    decreaseCartquantity
}