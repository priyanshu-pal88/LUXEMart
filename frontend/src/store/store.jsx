import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import productSlice from './productSlice'
import cartSlice from './cartSlice'

export const store = configureStore({
  reducer: {
    userReducer : userSlice,
    productReducer : productSlice,
    cartReducer : cartSlice
  },
})