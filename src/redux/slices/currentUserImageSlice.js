import { createSlice } from '@reduxjs/toolkit';

const currentUserImageSlice = createSlice({
    name: 'currentUserImage',
    initialState: {
        currentUserImage: null,
    },
    reducers: {
        setCurrentUserImageSlice(state, action) {
            state.currentUserImage = action.payload;
        },
    },
});

export const { setCurrentUserImageSlice } = currentUserImageSlice.actions;
export default currentUserImageSlice.reducer;
