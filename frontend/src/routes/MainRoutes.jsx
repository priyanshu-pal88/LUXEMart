import { Routes, Route } from "react-router-dom";
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from "../pages/Cart";
import Home from "../pages/Home";
import UserProfile from "../pages/UserProfile";



const MainRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/user-profile' element={<UserProfile />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  )
}

export default MainRoutes