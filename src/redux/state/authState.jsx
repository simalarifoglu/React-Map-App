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

    extraReducers: (builder) => {
      builder.addCase("UPDATE_USER", (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            ...action.payload,
          };
        }
      });
    }
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;

export const logoutAndClearData = () => (dispatch) => {
  dispatch(logout());
  dispatch(clearObjects());
};

export const loginSuccessAndReset = (user) => async (dispatch) => {
  console.log("Kullanıcı login oldu:", user); 
  dispatch(clearObjects());
  dispatch(loginSuccess({ token: null, user: user }));
  await dispatch(getFilteredObjects());
};

export const updateUser = (updatedUser) => ({
  type: "UPDATE_USER",
  payload: updatedUser,
});


export default authSlice.reducer;
