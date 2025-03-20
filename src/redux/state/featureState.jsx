import { createSlice } from '@reduxjs/toolkit';

const featureSlice = createSlice({
  name: 'feature',
  initialState: {
    feature: null,  
  },
  reducers: {
    setFeature(state, action) { 
      state.feature = action.payload;
    },
    clearFeature(state) { 
      state.feature = null;
    },
  },
});

export const { setFeature, clearFeature } = featureSlice.actions;
export default featureSlice.reducer;
