import { configureStore } from '@reduxjs/toolkit';
import nicknameSlice from './slices/nicknameSlice';
import idVideoSlice from './slices/idVideoSlice';
import indexVideoSlice from './slices/indexVideoSlice';

const store = configureStore({
    reducer: {
        getNickname: nicknameSlice,
        idVideo: idVideoSlice,
        indexVideo: indexVideoSlice,
    },
});

export default store;
