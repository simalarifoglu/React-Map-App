import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isInitialized = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isInitialized = true;
    },
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
