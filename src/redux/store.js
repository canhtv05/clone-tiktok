import { configureStore } from '@reduxjs/toolkit';
import nicknameSlice from './slices/nicknameSlice';
import idVideoSlice from './slices/idVideoSlice';
import indexVideoSlice from './slices/indexVideoSlice';
import currentUserSlice from './slices/currentUserSlice';
import myAccountSlice from './slices/myAccountSlice';
import loginSuccessSlice from './slices/loginSuccessSlice';
import listVideoSlice from './slices/listVideoSlice';

const store = configureStore({
    reducer: {
        getNickname: nicknameSlice,
        idVideo: idVideoSlice,
        indexVideo: indexVideoSlice,
        currentUser: currentUserSlice,
        myAccount: myAccountSlice,
        successLogin: loginSuccessSlice,
        listVideo: listVideoSlice,
    },
});

export default store;
