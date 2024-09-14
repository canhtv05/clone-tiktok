import { createSlice } from '@reduxjs/toolkit';

const listVideoSlice = createSlice({
    name: 'listVideo',
    initialState: { listVideo: [] },
    reducers: {
        setListVideos(state, action) {
            state.listVideo = action.payload;
        },
    },
});

export const { setListVideos } = listVideoSlice.actions;
export default listVideoSlice.reducer;
