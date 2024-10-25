import { createSlice } from '@reduxjs/toolkit';

const listFollowingNotLoginSlice = createSlice({
    name: 'listFollowingNotLogin',
    initialState: { listFollowingNotLogin: [] },
    reducers: {
        setListFollowingNotLoginSlice(state, action) {
            state.listFollowingNotLogin.push(...action.payload);
        },
    },
});

export const { setListFollowingNotLoginSlice } = listFollowingNotLoginSlice.actions;
export default listFollowingNotLoginSlice.reducer;
