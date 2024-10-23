import { createSlice } from '@reduxjs/toolkit';

const previousLocationSlice = createSlice({
    name: 'previousLocation',
    initialState: { previousLocation: null },
    reducers: {
        setPreviousLocation(state, action) {
            state.previousLocation = action.payload;
        },
    },
});

export const { setPreviousLocation } = previousLocationSlice.actions;
export default previousLocationSlice.reducer;
