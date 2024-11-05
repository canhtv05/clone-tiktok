import { createSlice } from '@reduxjs/toolkit';

const pageSlice = createSlice({
    name: 'page',
    initialState: {
        indexPage: null,
        isReloadPage: false,
    },
    reducers: {
        setIndexPage(state, action) {
            state.indexPage = action.payload;
        },
        setReloadPage(state, action) {
            state.isReloadPage = action.payload;
        },
        resetPage(state) {
            state.indexPage = null;
            state.isReloadPage = false;
        },
    },
});

export const { setIndexPage, setReloadPage, resetPage } = pageSlice.actions;
export default pageSlice.reducer;
