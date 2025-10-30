import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryProducts, getProducts, getFeaturedProducts } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import LoadingPage from './LoadingPage';

const categories = [
  { label: "Electronics", value: "electronics", image: "/electronics.jpg" },
  { label: "Fashion", value: "fashion", image: "/fashion.jpg" },
  { label: "Shoes", value: "shoes", image: "/shoes.jpg" },
  { label: "Home & Kitchen", value: "home-kitchen", image: "/home-kitchen.jpeg" },
  { label: "Watches", value: "watches", image: "/watches.jpg" },
];

const Home = () => {
  const {products,featuredProducts,loading,error} = useSelector((state) => state.productReducer);
  const { isAuthenticated } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch featured products when component mounts
    if (isAuthenticated && !selected) {
      dispatch(getFeaturedProducts());
    }
  }, [dispatch, isAuthenticated, selected]);

  const cartHandler = async(productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    const action = await dispatch(addToCart({productId, quantity: 1}));
    if (addToCart.fulfilled.match(action)) {
      toast.success("Product added to cart");
    } else {
      toast.error("Error in adding to cart");
    }
  }

  const buyHandler = async(productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase items");
      return;
    }

    const response = await dispatch(addToCart({productId, quantity: 1}));
    if (addToCart.fulfilled.match(response)) {
      toast.success("Product added to cart. Proceed to checkout.");
      navigate('/cart')
      // Navigate to checkout page or open checkout modal
    } else {
      toast.error("Error in processing your purchase");
    }

  }

  const onCategoryClick = (value) => {
    setSelected(value);
    dispatch(getCategoryProducts({category:value}));
  };

  if (initialLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!selected ? (
          <div className="space-y-10 fade-in">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold">
                <span className="rose-gold-text">Exclusive</span>
                <span className="text-white"> Collections</span>
              </h1>
              <p className="text-gray-400 text-lg">Discover luxury in every category</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {categories.map((c) => (
                <div
                  key={c.value}
                  role="button"
                  tabIndex={0}
                  onClick={() => onCategoryClick(c.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onCategoryClick(c.value);
                    }
                  }}
                  className="glass-card group rounded-2xl overflow-hidden cursor-pointer w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                  aria-label={`View ${c.label}`}
                >
                  <div className="aspect-[4/3] w-full bg-black/20 overflow-hidden relative">
                    <img
                      src={c.image}
                      alt={c.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition">{c.label}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Products Section */}
            {isAuthenticated && featuredProducts?.length > 0 && (
              <div className="space-y-6 mt-16">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-bold">
                    <span className="rose-gold-text">Featured</span>
                    <span className="text-white"> Products</span>
                  </h2>
                  <p className="text-gray-400">Handpicked premium selections from each collection</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {featuredProducts.map((product) => (
                    <div key={product._id} className="glass-card group rounded-2xl overflow-hidden">
                      <div className="aspect-square bg-black/30 overflow-hidden relative">
                        <img 
                          src={product.images} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="premium-badge text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide">
                            Featured
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-white text-lg line-clamp-2 group-hover:text-pink-400 transition">
                            {product.title}
                          </h3>
                          <p className="text-sm text-pink-400 font-semibold uppercase tracking-wide">
                            {product.brand}
                          </p>
                        </div>
                        
                        <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-3xl font-bold rose-gold-text">₹{product.price?.amount}</span>
                        </div>
                        
                        <div className="flex gap-3 pt-2">
                          <button 
                            onClick={() => buyHandler(product._id)}
                            className="flex-1 luxury-btn text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                          >
                            <i className="ri-shopping-bag-line"></i>
                            Buy Now
                          </button>
                          <button 
                            onClick={() => cartHandler(product._id)}
                            className="flex-1 glass-card hover:bg-white/10 text-white py-3 px-4 rounded-xl transition font-bold text-sm flex items-center justify-center gap-2 border border-pink-500/30"
                          >
                            <i className="ri-shopping-cart-line"></i>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Section */}
            <footer className="glass-card rounded-2xl p-10 mt-20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="LUXEMart" className="w-10 h-10 object-contain" />
                    <h3 className="text-2xl font-bold rose-gold-text">LUXEMart</h3>
                  </div>
                  <p className="text-gray-400 text-sm">Your destination for luxury and premium products</p>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">Quick Links</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="hover:text-pink-400 transition cursor-pointer">About Us</li>
                    <li className="hover:text-pink-400 transition cursor-pointer">Shop</li>
                    <li className="hover:text-pink-400 transition cursor-pointer">Privacy Policy</li>
                    <li className="hover:text-pink-400 transition cursor-pointer">Terms & Conditions</li>
                  </ul>
                </div>

                {/* Customer Service */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">Customer Service</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="hover:text-pink-400 transition cursor-pointer">Contact Us</li>
                    <li className="hover:text-pink-400 transition cursor-pointer">Track Order</li>
                    <li className="hover:text-pink-400 transition cursor-pointer">Returns & Refunds</li>
                    <li className="hover:text-pink-400 transition cursor-pointer">FAQs</li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">Contact Us</h4>
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li className="flex items-center gap-2">
                      <i className="ri-phone-line text-pink-400"></i>
                      <span>+91 9999 43210</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-mail-line text-pink-400"></i>
                      <span>support@luxemart.com</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-map-pin-line text-pink-400"></i>
                      <span>Mumbai, India</span>
                    </li>
                    <li className="flex gap-3 pt-2">
                      <a href="#" className="w-9 h-9 glass-card rounded-lg flex items-center justify-center hover:bg-pink-500/20 transition">
                        <i className="ri-facebook-fill text-pink-400"></i>
                      </a>
                      <a href="#" className="w-9 h-9 glass-card rounded-lg flex items-center justify-center hover:bg-pink-500/20 transition">
                        <i className="ri-instagram-line text-pink-400"></i>
                      </a>
                      <a href="#" className="w-9 h-9 glass-card rounded-lg flex items-center justify-center hover:bg-pink-500/20 transition">
                        <i className="ri-twitter-line text-pink-400"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Copyright */}
              <div className="border-t border-white/10 mt-8 pt-6 text-center">
                <p className="text-gray-400 text-sm">© 2025 LUXEMart. All rights reserved.</p>
              </div>
            </footer>
          </div>
        ) : (
          <div className="space-y-8 fade-in">
            <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelected(null)} 
                  className="w-12 h-12 glass-card rounded-xl hover:bg-white/10 transition flex items-center justify-center"
                  aria-label="Back to categories"
                >
                  <i className="ri-arrow-left-line text-xl text-pink-400"></i>
                </button>
                <h2 className="text-3xl font-bold capitalize">
                  <span className="rose-gold-text">{selected}</span>
                  <span className="text-white"> Collection</span>
                </h2>
              </div>
            </div>

            {loading && (
              <div className="text-center py-20">
                <i className="ri-loader-4-line text-6xl text-pink-500 animate-spin"></i>
                <p className="mt-4 text-gray-300 text-lg">Loading products...</p>
              </div>
            )}
            
            {error && (
              <div className="glass-card border-2 border-red-500/30 rounded-2xl p-6 text-center">
                <p className="text-red-400 font-semibold">{error}</p>
              </div>
            )}
            
            {!loading && !error && products?.length === 0 && (
              <div className="text-center py-20">
                <i className="ri-shopping-bag-line text-8xl text-gray-600"></i>
                <p className="mt-4 text-gray-400 text-xl">No products found in this category.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <div key={product._id} className="glass-card group rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-black/30 overflow-hidden relative">
                    <img 
                      src={product.images} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="premium-badge text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide">
                        Premium
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-white text-lg line-clamp-2 group-hover:text-pink-400 transition">{product.title}</h3>
                      <p className="text-sm text-pink-400 font-semibold uppercase tracking-wide">{product.brand}</p>
                    </div>
                    
                    <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-3xl font-bold rose-gold-text">₹{product.price?.amount}</span>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button 
                      onClick={()=>buyHandler(product._id)}
                      className="flex-1 luxury-btn text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                        <i className="ri-shopping-bag-line"></i>
                        Buy Now
                      </button>
                      <button 
                        onClick={() => cartHandler(product._id)}
                        className="flex-1 glass-card hover:bg-white/10 text-white py-3 px-4 rounded-xl transition font-bold text-sm flex items-center justify-center gap-2 border border-pink-500/30"
                      >
                        <i className="ri-shopping-cart-line"></i>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home