import { createSlice } from '@reduxjs/toolkit';

const loginSuccessSlice = createSlice({
    name: 'successLogin',
    initialState: { successLogin: false },
    reducers: {
        setLoginSuccess(state, action) {
            state.successLogin = action.payload;
        },
    },
});

export const { setLoginSuccess } = loginSuccessSlice.actions;
export default loginSuccessSlice.reducer;
