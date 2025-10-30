import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Register = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()

  const submitHandler = async (user) => {
    const {firstname, lastname, email, password} = user
    try {
      await axios.post("http://localhost:3000/api/auth/register", { 
        fullname: { firstname, lastname }, 
        email, 
        password 
      })
      reset()
      toast.success("Registration successful! Please login.")
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl mb-6">
            <i className="ri-vip-diamond-fill text-4xl text-white"></i>
          </div>
          <h2 className="text-5xl font-bold mb-3">
            <span className="rose-gold-text">LUXEMart</span>
          </h2>
          <p className="text-gray-400 text-lg">Join our exclusive community</p>
        </div>

        <div className="glass-card rounded-3xl p-10">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  First Name
                </label>
                <input
                  {...register("firstname", { 
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "Must be at least 2 characters"
                    }
                  })}
                  type="text"
                  id="firstname"
                  placeholder="John"
                  className="block w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-500"
                />
                {errors.firstname && <p className="mt-2 text-xs text-red-400">{errors.firstname.message}</p>}
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Last Name
                </label>
                <input
                  {...register("lastname", {
                    required: "Last name is required"
                  })}
                  type="text"
                  id="lastname"
                  placeholder="Doe"
                  className="block w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-500"
                />
                {errors.lastname && <p className="mt-2 text-xs text-red-400">{errors.lastname.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-mail-line text-pink-400 text-xl"></i>
                </div>
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  className="block w-full pl-12 pr-4 py-4 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-500"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-lock-line text-pink-400 text-xl"></i>
                </div>
                <input
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  type="password"
                  id="password"
                  placeholder="Create a strong password"
                  className="block w-full pl-12 pr-4 py-4 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-500"
                />
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full luxury-btn py-4 px-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 text-lg mt-8"
            >
              <i className="ri-vip-diamond-line"></i>
              Join LUXEMart
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="rose-gold-text hover:text-pink-400 font-semibold transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register