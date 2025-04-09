import { createSlice } from "@reduxjs/toolkit";
import { clearObjects, getFilteredObjects } from "./mapObjectsState";

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

// 👇 logout action'ı tetiklenince objectSlice da temizlensin:
export const logoutAndClearData = () => (dispatch) => {
  dispatch(logout());
  dispatch(clearObjects());
};

export const loginSuccessAndReset = (user) => async (dispatch) => {
  dispatch(clearObjects());
  dispatch(loginSuccess({ token: null, user }));
  await dispatch(getFilteredObjects()); // login sonrası verileri hemen çek
};

export default authSlice.reducer;
