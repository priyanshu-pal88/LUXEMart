import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3000/api/cart/add-to-cart", { productId, quantity }, { withCredentials: true })
            console.log(response.data.message)
            return response.data.cart;
        }
        catch (err) {
            return rejectWithValue(err.message)
        }

    }
)

export const getCart = createAsyncThunk(
    "cart/getCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:3000/api/cart", { withCredentials: true })
            const cp = response.data?.cartProducts
            const cart = Array.isArray(cp) ? cp[0] : cp

            return cart.products
        }
        catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const increaseQuantity = createAsyncThunk(
    "cart/increaseQuantity",
    async ({ productId }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3000/api/cart/add-to-cart", { productId, quantity: 1 }, { withCredentials: true })
            console.log(response.data.message)
            console.log(response.data.cart.products)
            return response.data.cart.products;
        }
        catch (err) {
            return rejectWithValue(err.message)
        }
    }
)
export const decreaseQuantity = createAsyncThunk(
    "cart/decreaseQuantity",
    async ({ productId }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3000/api/cart/decrease-cart", { productId }, { withCredentials: true })
            console.log(response.data.message)
            return response.data.cart.products;
        }
        catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ productId }, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3000/api/cart/remove-cart", { productId }, { withCredentials: true })
            console.log(response.data.message)
            return response.data.cart.products;
        }
        catch (err) {
            return rejectWithValue(err.message)
        }
    }
)




const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
        loading: false,
        error: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            }
            )
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getCart.pending, (state) => {
                state.loading = true;
            }
            )
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(increaseQuantity.pending, (state) => {
                // Don't show loading for quantity changes
            }
            )
            .addCase(increaseQuantity.fulfilled, (state, action) => {
                state.cartItems = action.payload;
            }
            )
            .addCase(increaseQuantity.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(decreaseQuantity.pending, (state) => {
                // Don't show loading for quantity changes
            })
            .addCase(decreaseQuantity.fulfilled, (state, action) => {
                state.cartItems = action.payload;
            })
            .addCase(decreaseQuantity.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(removeFromCart.pending, (state) => {
                // Don't show loading for remove action
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cartItems = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.error = action.payload;
            })
            

    }

}
)

export default cartSlice.reducer;