import { createSlice } from '@reduxjs/toolkit';

const listVideosSlice = createSlice({
    name: 'listVideosHome',
    initialState: { listVideosHome: [] },
    reducers: {
        setListsVideoHome(state, action) {
            state.listVideosHome = action.payload;
        },
    },
});

export const { setListsVideoHome } = listVideosSlice.actions;
export default listVideosSlice.reducer;
