import { createSlice } from '@reduxjs/toolkit';

const infoCurrentUserSlice = createSlice({
    name: 'infoCurrentUser',
    initialState: {
        infoCurrentUser: {
            bio: '',
            followers: '0',
            likes: '0',
        },
    },
    reducers: {
        setInfoCurrentUser(state, action) {
            state.infoCurrentUser = action.payload;
        },
        setBioCurrentUser(state, action) {
            state.infoCurrentUser.bio = action.payload;
        },
    },
});

export const { setInfoCurrentUser, setBioCurrentUser } = infoCurrentUserSlice.actions;
export default infoCurrentUserSlice.reducer;
