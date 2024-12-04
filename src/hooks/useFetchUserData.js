// hooks/useFetchUserData.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../services/auth/getCurrentUser';
import { getProfile } from '../services/users/getProfile';
import { setCurrentUser } from '../redux/slices/currentUserSlice';
import { setFullNameCurrentUser } from '../redux/slices/fullNameCurrentUserSlice';
import { setCurrentUserImageSlice } from '../redux/slices/currentUserImageSlice';
import { setInfoCurrentUser } from '../redux/slices/infoCurrentUserSlice';

const useFetchUserData = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.currentUser.currentUser);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!user && token) {
            const fetchApi = async () => {
                const res = await getCurrentUser(token);
                try {
                    dispatch(setCurrentUser(res.data.nickname));
                } catch (error) {
                    console.log(error);
                }
            };
            fetchApi();
        }

        if (user && token) {
            const fetchApi = async () => {
                const res = await getProfile(`@${user}`, token);
                try {
                    dispatch(setFullNameCurrentUser(`${res.first_name} ${res.last_name || res.nickname}`));
                    dispatch(
                        setInfoCurrentUser({
                            bio: `${res.bio}`,
                            followers: `${res.followers_count || '0'}`,
                            likes: `${res.likes_count}`,
                        }),
                    );
                    dispatch(setCurrentUserImageSlice(res.avatar));
                } catch (error) {
                    console.log(error);
                }
            };
            fetchApi();
        }
    }, [dispatch, user, token]);
};

export default useFetchUserData;
