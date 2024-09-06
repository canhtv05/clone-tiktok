import { createSlice } from '@reduxjs/toolkit';

const indexVideoSlice = createSlice({
    name: 'indexVideo',
    initialState: { index: null },
    reducers: {
        setIndexVideo(state, action) {
            state.index = action.payload;
        },
    },
});

export const { setIndexVideo } = indexVideoSlice.actions;
export default indexVideoSlice.reducer;
