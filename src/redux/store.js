import { configureStore } from '@reduxjs/toolkit';
import nicknameSlice from './slices/nicknameSlice';
import idVideoSlice from './slices/idVideoSlice';

const store = configureStore({
    reducer: {
        getNickname: nicknameSlice,
        idVideo: idVideoSlice,
    },
});

export default store;
