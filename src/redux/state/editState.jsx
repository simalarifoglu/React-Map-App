import { createSlice } from '@reduxjs/toolkit';

const editSlice = createSlice({
  name: 'Edit',
  initialState: {
    edit: false,
  },
  reducers: {
    onEdit: (state) => {
      state.edit = true;
    },
    offEdit: (state) => {
      state.edit = false;
    },
  },
});

export const { onEdit, offEdit } = editSlice.actions;
export default editSlice.reducer;