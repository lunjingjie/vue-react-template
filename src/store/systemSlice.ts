import { createSlice } from '@reduxjs/toolkit';

export const systemSlice = createSlice({
	name: 'system',
	initialState: {
		theme: 'light',
    collapsed: false,
	},
	reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setCollapsed:  (state, action) => {
      state.collapsed = action.payload;
    },
	}
});

export const { setTheme, setCollapsed } = systemSlice.actions;

export default systemSlice.reducer;
