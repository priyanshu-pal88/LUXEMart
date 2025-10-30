import { useEffect, useState, lazy, Suspense } from "react"
import { useDispatch, useSelector } from "react-redux"
import { decreaseQuantity, getCart, removeFromCart } from "../store/cartSlice"
import { increaseQuantity } from "../store/cartSlice"
import { useNavigate } from "react-router-dom"

// Lazy load payment button component
const PaymentButton = lazy(() => import("../components/PaymentButton"))

const Cart = () => {
  const { cartItems, loading } = useSelector((state) => state.cartReducer)
  const { isAuthenticated } = useSelector((state) => state.userReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [cartLoaded, setCartLoaded] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Fetch cart only once when component mounts and user is authenticated
    if (!cartLoaded) {
      dispatch(getCart())
      setCartLoaded(true)
    }
  }, [isAuthenticated, dispatch, navigate, cartLoaded])

  const items = Array.isArray(cartItems) ? cartItems : (cartItems?.products || [])
  
  const MAX_QUANTITY = 5;

  const increaseQuanty = (id, currentQuantity) => {
    if (currentQuantity >= MAX_QUANTITY) {
      return; // Don't increase if already at max
    }
    dispatch(increaseQuantity({ productId: id }))
  }

  const decreaseQuanty = (id) => {
    dispatch(decreaseQuantity({ productId: id }))
  }

  const removeCart = (id) => {
    dispatch(removeFromCart({ productId: id }))
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = item?.productId?.price?.amount || 0
      return total + (price * item.quantity)
    }, 0).toFixed(2)
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-6xl text-pink-500 animate-spin"></i>
          <p className="mt-4 text-gray-300 text-lg">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 fade-in">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center">
            <i className="ri-shopping-cart-line text-5xl text-white"></i>
          </div>
          <h2 className="text-4xl font-bold">
            <span className="text-white">Your Cart is</span>
            <span className="rose-gold-text"> Empty</span>
          </h2>
          <p className="text-gray-400 text-lg">Start your luxury shopping experience</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 luxury-btn px-8 py-4 rounded-xl font-bold tracking-wide"
          >
            Explore Collections
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10 fade-in">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <i className="ri-shopping-cart-line text-2xl text-white"></i>
          </div>
          <h1 className="text-4xl font-bold">
            <span className="text-white">Shopping</span>
            <span className="rose-gold-text"> Cart</span>
          </h1>
          <span className="premium-badge text-white text-sm px-4 py-2 rounded-xl">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => {
              const p = typeof item.productId === "object" ? item.productId : null
              const productId = p?._id

              return (
                <div key={item._id} className="glass-card rounded-2xl overflow-hidden">
                  <div className="flex gap-6 p-6">
                    {/* Product Image */}
                    <div className="w-36 h-36 flex-shrink-0 bg-black/30 rounded-xl overflow-hidden relative">
                      <img 
                        src={p?.images} 
                        alt={p?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="premium-badge text-white text-xs px-2 py-1 rounded">PREMIUM</span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-bold text-white text-xl line-clamp-1">{p?.title || "Product"}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mt-1">{p?.description || ""}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Qty</span>
                        <button 
                          onClick={() => decreaseQuanty(productId)}
                          className="w-10 h-10 flex items-center justify-center glass-card rounded-lg hover:bg-white/10 transition text-pink-400 font-bold"
                          aria-label="Decrease quantity"
                        >
                          <i className="ri-subtract-line"></i>
                        </button>
                        <span className="w-14 text-center font-bold text-white text-lg">{item.quantity}</span>
                        <button 
                          onClick={() => increaseQuanty(productId, item.quantity)}
                          disabled={item.quantity >= MAX_QUANTITY}
                          className={`w-10 h-10 flex items-center justify-center glass-card rounded-lg transition text-pink-400 font-bold ${
                            item.quantity >= MAX_QUANTITY ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
                          }`}
                          aria-label="Increase quantity"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                        {item.quantity >= MAX_QUANTITY && (
                          <span className="text-xs text-pink-400">Max limit</span>
                        )}
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <span className="text-3xl font-bold rose-gold-text">
                          ₹{p?.price?.amount}
                        </span>
                        <button 
                          onClick={() => removeCart(productId)}
                          className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 font-medium transition"
                        >
                          <i className="ri-delete-bin-line"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-8 sticky top-20 space-y-6">
              <h2 className="text-2xl font-bold rose-gold-text flex items-center gap-2">
                <i className="ri-file-list-3-line"></i>
                Order Summary
              </h2>
              
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-gray-300">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold text-white">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="font-medium">Shipping</span>
                  <span className="font-semibold text-pink-400">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold pt-6 border-t border-white/10">
                <span className="text-white">Total</span>
                <span className="text-3xl rose-gold-text">₹{calculateTotal()}</span>
              </div>

              <Suspense fallback={
                <div className="w-full py-4 text-center">
                  <i className="ri-loader-4-line text-2xl text-pink-500 animate-spin"></i>
                </div>
              }>
                <PaymentButton />
              </Suspense>
              
              <button 
                onClick={() => navigate('/')}
                className="w-full glass-card py-4 rounded-xl hover:bg-white/10 transition font-medium flex items-center justify-center gap-2 text-gray-300 hover:text-pink-400"
              >
                <i className="ri-arrow-left-line"></i>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart