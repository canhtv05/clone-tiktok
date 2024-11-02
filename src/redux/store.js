import { configureStore } from '@reduxjs/toolkit';
import nicknameSlice from './slices/nicknameSlice';
import indexVideoSlice from './slices/indexVideoSlice';
import currentUserSlice from './slices/currentUserSlice';
import myAccountSlice from './slices/myAccountSlice';
import loginSuccessSlice from './slices/loginSuccessSlice';
import listVideoSlice from './slices/listVideoSlice';
import currentUserImage from './slices/currentUserImageSlice';
import idUserSlice from './slices/idUserSlice';
import fullNameCurrentUserSlice from './slices/fullNameCurrentUserSlice';
import commentCountSlice from './slices/commentCountSlice';
import infoCurrentUserSlice from './slices/infoCurrentUserSlice';
import changeIndexVideoSlice from './slices/changeIndexVideoSlice';
import followingAUserSlice from './slices/followingAUserSlice';
import profileSlice from './slices/profileSlice';
import listSuggestedAccountSlice from './slices/listSuggestedAccountSlice';
import listFollowingAccountSlice from './slices/listFollowingAccountSlice';
import previousLocationSlice from './slices/previousLocationSlice';
import listFollowingNotLoginSlice from './slices/listFollowingNotLoginSlice';
import listVideosHomeSlice from './slices/listVideosHomeSlice';
import indexVideoHomeSlice from './slices/indexVideoHomeSlice';

const store = configureStore({
    reducer: {
        getNickname: nicknameSlice,
        indexVideo: indexVideoSlice,
        currentUser: currentUserSlice,
        myAccount: myAccountSlice,
        successLogin: loginSuccessSlice,
        listVideo: listVideoSlice,
        currentUserImage: currentUserImage,
        idUser: idUserSlice,
        fullNameCurrentUser: fullNameCurrentUserSlice,
        commentCount: commentCountSlice,
        infoCurrentUser: infoCurrentUserSlice,
        changeIndexVideo: changeIndexVideoSlice,
        followingUser: followingAUserSlice,
        profile: profileSlice,
        listSuggestedAccount: listSuggestedAccountSlice,
        listFollowingAccount: listFollowingAccountSlice,
        previousLocation: previousLocationSlice,
        listFollowingNotLogin: listFollowingNotLoginSlice,
        listVideosHome: listVideosHomeSlice,
        indexVideoHome: indexVideoHomeSlice,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
