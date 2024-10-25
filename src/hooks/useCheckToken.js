import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUserImageSlice } from '~/redux/slices/currentUserImageSlice';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { setCurrentUser } from '~/redux/slices/currentUserSlice';
import { setFullNameCurrentUser } from '~/redux/slices/fullNameCurrentUserSlice';
import { setProfile } from '~/redux/slices/profileSlice';
import { setInfoCurrentUser } from '~/redux/slices/infoCurrentUserSlice';
import { setListFollowingAccount } from '~/redux/slices/listFollowingAccountSlice';
import { setListSuggestedAccount } from '~/redux/slices/listSuggestedAccountSlice';

const useCheckToken = () => {
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            dispatch(setCurrentUserImageSlice(null));
            dispatch(setMyAccount(false));
            dispatch(setCurrentUser(null));
            dispatch(setFullNameCurrentUser(null));
            dispatch(setInfoCurrentUser({}));
            dispatch(setProfile({}));
            dispatch(setListFollowingAccount([]));
            dispatch(setListSuggestedAccount([]));
            localStorage.removeItem('list-message');
        }
    }, [token, dispatch]);
};

export default useCheckToken;
