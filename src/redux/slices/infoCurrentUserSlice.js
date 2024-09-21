import { createSlice } from '@reduxjs/toolkit';

const infoCurrentUserSlice = createSlice({
    name: 'infoCurrentUser',
    initialState: { infoCurrentUser: {} },
    reducers: {
        setInfoCurrentUser(state, action) {
            state.infoCurrentUser = action.payload;
        },
    },
});

export const { setInfoCurrentUser } = infoCurrentUserSlice.actions;
export default infoCurrentUserSlice.reducer;
