import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const NavBar = () => {
  const { isAuthenticated } = useSelector((state) => state.userReducer)

  return (
    <nav className='glass-card sticky top-0 z-50 border-b border-white/10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo */}
          <NavLink to="/" className='flex items-center gap-3 group'>
            <div className='w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform'>
              <img src="/logo.png" alt="LUXEMart" className="w-full h-full object-contain" />
            </div>
            <span className='text-2xl font-bold rose-gold-text'>LUXEMart</span>
          </NavLink>

          {/* Nav Links */}
          <div className='flex items-center gap-8'>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center gap-2 font-semibold transition-all ${
                  isActive 
                    ? 'text-pink-400' 
                    : 'text-gray-300 hover:text-pink-400'
                }`
              }
            >
              <i className="ri-home-5-line text-xl"></i>
              <span>Home</span>
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/cart" 
                  className={({ isActive }) => 
                    `flex items-center gap-2 font-semibold transition-all ${
                      isActive 
                        ? 'text-pink-400' 
                        : 'text-gray-300 hover:text-pink-400'
                    }`
                  }
                >
                  <i className="ri-shopping-cart-line text-xl"></i>
                  <span>Cart</span>
                </NavLink>
                <NavLink 
                  to="/user-profile" 
                  className={({ isActive }) => 
                    `flex items-center gap-2 font-semibold transition-all ${
                      isActive 
                        ? 'text-pink-400' 
                        : 'text-gray-300 hover:text-pink-400'
                    }`
                  }
                >
                  <i className="ri-user-line text-xl"></i>
                  <span>Profile</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `flex items-center gap-2 font-semibold transition-all ${
                      isActive 
                        ? 'text-pink-400' 
                        : 'text-gray-300 hover:text-pink-400'
                    }`
                  }
                >
                  <i className="ri-login-box-line text-xl"></i>
                  <span>Sign In</span>
                </NavLink>
                <NavLink 
                  to="/register" 
                  className='luxury-btn text-white px-6 py-2.5 rounded-xl font-bold tracking-wide'
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar