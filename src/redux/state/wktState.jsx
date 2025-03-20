import { createSlice } from '@reduxjs/toolkit';

const wktSlice = createSlice({
  name: 'wkt',
  initialState: {
    wktData: null,
    name: null, 
  },
  reducers: {
    setWkt(state, action) {
      state.wktData = action.payload.wktData;
      state.name = action.payload.name;
    },
    clearWkt(state) {
      state.wktData = null;
      state.name = null;
    },
    
  },
});

export const { setWkt, clearWkt, setName } = wktSlice.actions;
export default wktSlice.reducer;
