import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";





export const getProducts = createAsyncThunk(
    "product/getProducts",
    async (_, { rejectWithValue }) => {
        try {

            const response = await axios.get("http://localhost:3000/api/products", { withCredentials: true });
            console.log(response.data.message)
            return response.data.products;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCategoryProducts = createAsyncThunk(
    "product/getCategoryProduct",
   async ({category}, { rejectWithValue }) => {
        try {

            const response = await axios.get(`http://localhost:3000/api/products/get-item/${category}`, { withCredentials: true });
            console.log(response.data.message)
            return response.data.product;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getFeaturedProducts = createAsyncThunk(
    "product/getFeaturedProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:3000/api/products/featured", { withCredentials: true });
            console.log(response.data.message)
            return response.data.products;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        featuredProducts: [],
        loading: false,
        error: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCategoryProducts.pending, (state) => {
                state.loading = true;
                state.products = []; // Clear old products immediately
                state.error = null;
            })
            .addCase(getCategoryProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getCategoryProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.products = []; // Clear products on error
            })
            .addCase(getFeaturedProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFeaturedProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.featuredProducts = action.payload;
            })
            .addCase(getFeaturedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }

}
)



export default productSlice.reducer;