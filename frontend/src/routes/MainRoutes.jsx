import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load page components
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Cart = lazy(() => import("../pages/Cart"));
const Home = lazy(() => import("../pages/Home"));
const UserProfile = lazy(() => import("../pages/UserProfile"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <i className="ri-loader-4-line text-6xl text-pink-500 animate-spin"></i>
      <p className="mt-4 text-gray-300 text-lg">Loading...</p>
    </div>
  </div>
);

const MainRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/user-profile' element={<UserProfile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Suspense>
  )
}

export default MainRoutes