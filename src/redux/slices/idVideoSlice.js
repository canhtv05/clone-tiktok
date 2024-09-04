import { createSlice } from '@reduxjs/toolkit';

const idVideoSlice = createSlice({
    name: 'idVideo',
    initialState: { hashVideo: '' },
    reducers: {
        setIdVideo(state, action) {
            return state.hashVideo === action.payload;
        },
    },
});

export const { setIdVideo } = idVideoSlice.actions;
export default idVideoSlice.reducer;
