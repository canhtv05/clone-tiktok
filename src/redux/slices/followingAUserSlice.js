import { createSlice } from '@reduxjs/toolkit';

const followingAUser = createSlice({
    name: 'followingUser',
    initialState: { followingUser: false },
    reducers: {
        setFollowingAUser(state, action) {
            state.followingUser = action.payload;
        },
    },
});

export const { setFollowingAUser } = followingAUser.actions;
export default followingAUser.reducer;
