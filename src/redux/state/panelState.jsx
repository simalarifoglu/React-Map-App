import { createSlice } from '@reduxjs/toolkit';

const panelSlice = createSlice({
  name: 'panel',
  initialState: {
    isOpen: false,
    isEdit: false,
  },
  reducers: {
    openPanel: (state) => {
      state.isOpen = true;
    },
    closePanel: (state) => {
      state.isOpen = false;
    },
    onEditPanel: (state) => {
      state.isEdit = true;
    },
    offEditPanel: (state) => {
      state.isEdit = false;
    },
  },
});

export const { openPanel, closePanel, onEditPanel, offEditPanel } = panelSlice.actions;
export default panelSlice.reducer;
