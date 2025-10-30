import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editUserInfo, getUserInfo, logoutUser } from '../store/userSlice'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const UserProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const { userInfo, isAuthenticated, loading, error } = useSelector((state) => state.userReducer)
  const { register, reset, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstname: userInfo?.fullname?.firstname || '',
      lastname: userInfo?.fullname?.lastname || '',
      email: userInfo?.email || '',
    }
  })

  useEffect(() => {
    if (!userInfo) {
      dispatch(getUserInfo())
    }
  }, [dispatch, userInfo])

  useEffect(() => {
    if (userInfo) {
      reset({
        firstname: userInfo?.fullname?.firstname || '',
        lastname: userInfo?.fullname?.lastname || '',
        email: userInfo?.email || '',
      })
    }
  }, [userInfo, reset])

  const submitHandler = async (data) => {
    const { firstname, lastname, email } = data
    try {
      await dispatch(editUserInfo({ firstname, lastname, email })).unwrap()
      toast.success("Profile updated successfully")
      setEdit(false)
    } catch (error) {
      toast.error(error || "Failed to update profile")
    }
  }

  const logoutHandler = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success("Logged out successfully")
    } finally {
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-6xl text-pink-500 animate-spin"></i>
          <p className="mt-4 text-gray-400 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 fade-in">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center">
            <i className="ri-user-line text-5xl text-white"></i>
          </div>
          <h2 className="text-3xl font-bold rose-gold-text">Access Required</h2>
          <p className="text-gray-400 text-lg">You need to be logged in to view your profile</p>
          <button 
            onClick={() => navigate('/login')}
            className="luxury-btn px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 mx-auto"
          >
            <i className="ri-login-box-line"></i>
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {edit ? (
          <div className="glass-card rounded-3xl p-10 fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <i className="ri-user-settings-line text-2xl text-white"></i>
              </div>
              <h2 className="text-3xl font-bold rose-gold-text">Edit Profile</h2>
            </div>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                    First Name
                  </label>
                  <input
                    {...register("firstname", { required: "First name is required" })}
                    type="text"
                    id="firstname"
                    className="block w-full px-4 py-4 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                  />
                  {errors.firstname && <p className="mt-2 text-xs text-red-400">{errors.firstname.message}</p>}
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                    Last Name
                  </label>
                  <input
                    {...register("lastname", { required: "Last name is required" })}
                    type="text"
                    id="lastname"
                    className="block w-full px-4 py-4 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                  />
                  {errors.lastname && <p className="mt-2 text-xs text-red-400">{errors.lastname.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Email Address
                </label>
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
                  className="block w-full px-4 py-4 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                />
                {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 luxury-btn py-4 px-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                >
                  <i className="ri-save-line"></i>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEdit(false)}
                  className="flex-1 glass-card py-4 px-4 rounded-xl hover:bg-white/10 transition font-semibold text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="glass-card rounded-3xl overflow-hidden fade-in">
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 px-10 py-16 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative flex items-center gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30">
                  <i className="ri-vip-diamond-fill text-5xl"></i>
                </div>
                <div>
                  <span className="premium-badge text-white text-xs px-3 py-1 rounded-lg mb-3 inline-block">VIP MEMBER</span>
                  <h1 className="text-4xl font-bold">
                    {userInfo?.fullname?.firstname} {userInfo?.fullname?.lastname}
                  </h1>
                  <p className="text-gray-300 mt-2 text-lg">{userInfo?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-semibold uppercase tracking-wide">First Name</label>
                  <p className="text-2xl text-white font-medium">{userInfo?.fullname?.firstname}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-semibold uppercase tracking-wide">Last Name</label>
                  <p className="text-2xl text-white font-medium">{userInfo?.fullname?.lastname}</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-gray-400 font-semibold uppercase tracking-wide">Email Address</label>
                  <p className="text-2xl rose-gold-text font-medium">{userInfo?.email}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-white/10">
                <button
                  onClick={() => setEdit(true)}
                  className="flex-1 bg-blue-600 py-4 px-4 rounded-xl hover:bg-blue-700 transition font-semibold text-white flex items-center justify-center gap-2"
                >
                  <i className="ri-edit-line"></i>
                  Edit Profile
                </button>
                <button
                  onClick={logoutHandler}
                  className="flex-1 glass-card py-4 px-4 rounded-xl hover:bg-red-500/20 transition font-semibold text-red-400 hover:text-red-300 flex items-center justify-center gap-2 border border-red-500/30"
                >
                  <i className="ri-logout-box-line"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile