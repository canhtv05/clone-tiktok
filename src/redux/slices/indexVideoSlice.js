import { createSlice } from '@reduxjs/toolkit';

const indexVideoSlice = createSlice({
    name: 'indexVideo',
    initialState: { index: JSON.parse(sessionStorage.getItem('i')) || null },
    reducers: {
        setIndexVideo(state, action) {
            state.index = action.payload;
            sessionStorage.setItem('i', action.payload);
        },
    },
});

export const { setIndexVideo } = indexVideoSlice.actions;
export default indexVideoSlice.reducer;
