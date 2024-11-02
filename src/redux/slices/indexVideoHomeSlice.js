import { createSlice } from '@reduxjs/toolkit';

const indexVideoHomeSlice = createSlice({
    name: 'indexVideoHome',
    initialState: { indexVideoHome: null },
    reducers: {
        setIndexVideoHome(state, action) {
            state.indexVideoHome = action.payload;
        },
    },
});

export const { setIndexVideoHome } = indexVideoHomeSlice.actions;
export default indexVideoHomeSlice.reducer;
