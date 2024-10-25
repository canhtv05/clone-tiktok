import { createSlice } from '@reduxjs/toolkit';

const myAccountSlice = createSlice({
    name: 'myAccount',
    initialState: { myAccount: false },
    reducers: {
        setMyAccount(state, action) {
            state.myAccount = action.payload;
        },
    },
});

export const { setMyAccount } = myAccountSlice.actions;
export default myAccountSlice.reducer;
