import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";




export const loginUser = createAsyncThunk(
  "user/loginUser",             
  async ({ email, password }, { rejectWithValue }) => {
    try {
      
      const response = await axios.post("http://localhost:3000/api/auth/login",{email,password} ,{ withCredentials: true }  );
      console.log(response.data.message)

      if (!response.data.user) {
        toast.error("Invalid credentials");
        return rejectWithValue("Invalid credentials");
      }

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  })


  export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.post("http://localhost:3000/api/auth/logout",{}, { withCredentials: true });
        console.log(response.data.message);
        return response.data.message;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );


export const getUserInfo = createAsyncThunk(
  'user/getUser',
  async(_,{rejectWithValue})=>{
    try{
     const response = await axios.get("http://localhost:3000/api/auth/verify",{withCredentials : true})
     console.log(response)
     return response.data.user
    }
    catch(err){
      return rejectWithValue(err.message)
    }
  }
)

export const editUserInfo = createAsyncThunk(
  "user/editUser",
  async({firstname,lastname,email},{rejectWithValue }) =>{
    try{
     const response = await axios.patch("http://localhost:3000/api/auth/edit-user",{fullname:{firstname,lastname},email},{withCredentials:true})
      return response.data.user
    }
    catch(err){
      return rejectWithValue(err.message)
    }
  }
)


const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: null,
        loading: false,
        isAuthenticated: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.userInfo = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUserInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             .addCase(editUserInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(editUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(editUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    }
})

export const {clearError} = userSlice.actions

export default  userSlice.reducer