import { createSlice } from '@reduxjs/toolkit';

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: { currentUser: JSON.parse(localStorage.getItem('user')) || null },
    reducers: {
        setCurrentUser(state, action) {
            state.currentUser = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
    },
});

export const { setCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
