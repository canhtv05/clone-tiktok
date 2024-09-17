import { createSlice } from '@reduxjs/toolkit';

const fullNameCurrentUserSlice = createSlice({
    name: 'fullNameCurrentUser',
    initialState: {
        fullNameCurrentUser: null,
    },
    reducers: {
        setFullNameCurrentUser(state, action) {
            state.fullNameCurrentUser = action.payload;
        },
    },
});

export const { setFullNameCurrentUser } = fullNameCurrentUserSlice.actions;
export default fullNameCurrentUserSlice.reducer;
