import { createSlice } from '@reduxjs/toolkit';

export const conuterSlice = createSlice({
	name: 'counter',
	initialState: {
		value: 0
	},
	reducers: {
		increment: (state) => {
			state.value += 1;
		},
		decrement: (state) => {
			state.value -= 1;
		},
		increamentByAmount: (state, action) => {
			state.value += action.payload;
		}
	}
});

export const { increment, decrement, increamentByAmount } = conuterSlice.actions;

export default conuterSlice.reducer;
