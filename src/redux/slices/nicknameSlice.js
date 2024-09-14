import { createSlice } from '@reduxjs/toolkit';

const nicknameSlice = createSlice({
    name: 'getNickname',
    initialState: { nickname: localStorage.getItem('nickname') || '' },
    reducers: {
        setNickName: (state, action) => {
            state.nickname = action.payload;
            localStorage.setItem('nickname', action.payload);
        },
    },
});

export const { setNickName } = nicknameSlice.actions;
export default nicknameSlice.reducer;
