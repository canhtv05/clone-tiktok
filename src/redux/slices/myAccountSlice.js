import { createSlice } from '@reduxjs/toolkit';

const myAccountSlice = createSlice({
    name: 'myAccount',
    initialState: { myAccount: JSON.parse(localStorage.getItem('myAccount')) || null },
    reducers: {
        setMyAccount(state, action) {
            state.myAccount = action.payload;
            localStorage.setItem('myAccount', JSON.stringify(action.payload));
        },
    },
});

export const { setMyAccount } = myAccountSlice.actions;
export default myAccountSlice.reducer;
