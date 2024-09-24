import { createSlice } from '@reduxjs/toolkit';

const changeIndexVideoSlice = createSlice({
    name: 'changeIndexVideo',
    initialState: {
        changeIndexVideo: false,
    },
    reducers: {
        setChangeIndexVideo(state, action) {
            state.changeIndexVideo = action.payload;
        },
    },
});

export const { setChangeIndexVideo } = changeIndexVideoSlice.actions;
export default changeIndexVideoSlice.reducer;
