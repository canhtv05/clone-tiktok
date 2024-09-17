import { createSlice } from '@reduxjs/toolkit';

const commentCountSlice = createSlice({
    name: 'commentCount',
    initialState: {
        commentCount: null,
    },
    reducers: {
        setCommentCount(state, action) {
            state.commentCount = action.payload;
        },
    },
});

export const { setCommentCount } = commentCountSlice.actions;
export default commentCountSlice.reducer;
