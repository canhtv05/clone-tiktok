import { createSlice } from '@reduxjs/toolkit';

const followingSlice = createSlice({
    name: 'following',
    initialState: {},
    reducers: {
        updateFollowStatus(state, action) {
            const { userId, isFollowing } = action.payload;
            state[userId] = isFollowing;
        },
    },
});

export const { updateFollowStatus } = followingSlice.actions;
export default followingSlice.reducer;
