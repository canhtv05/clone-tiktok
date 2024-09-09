import { configureStore } from '@reduxjs/toolkit';
import nicknameSlice from './slices/nicknameSlice';
import idVideoSlice from './slices/idVideoSlice';
import indexVideoSlice from './slices/indexVideoSlice';
import currentUserSlice from './slices/currentUserSlice';

const store = configureStore({
    reducer: {
        getNickname: nicknameSlice,
        idVideo: idVideoSlice,
        indexVideo: indexVideoSlice,
        currentUser: currentUserSlice,
    },
});

export default store;
