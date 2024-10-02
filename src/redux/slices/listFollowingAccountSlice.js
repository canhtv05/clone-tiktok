import { createSlice } from '@reduxjs/toolkit';

const listFollowingAccountSlice = createSlice({
    name: 'listFollowingAccount',
    initialState: { listFollowingAccount: [] },
    reducers: {
        setListFollowingAccount(state, action) {
            state.listFollowingAccount = action.payload;
        },
    },
});

export const { setListFollowingAccount } = listFollowingAccountSlice.actions;
export default listFollowingAccountSlice.reducer;
