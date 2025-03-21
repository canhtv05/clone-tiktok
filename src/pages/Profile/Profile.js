import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import ProfileDetail from './ProfileDetail';
import Content from './Content';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getProfile } from '~/services/users/getProfile';
import { setCurrentUserImageSlice } from '~/redux/slices/currentUserImageSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';
import { setFullNameCurrentUser } from '~/redux/slices/fullNameCurrentUserSlice';
import { setInfoCurrentUser } from '~/redux/slices/infoCurrentUserSlice';
import { setProfile } from '~/redux/slices/profileSlice';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { setCurrentUser } from '~/redux/slices/currentUserSlice';

const cx = classNames.bind(styles);

function Profile() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(null);
    const currentUser = useSelector((state) => state.currentUser.currentUser);
    const myProfile = useSelector((state) => state.myAccount.myAccount);
    const { nickname } = useParams();
    const profile = useSelector((state) => state.profile.data);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            dispatch(setMyAccount(false));
            dispatch(setCurrentUser(null));
        }
    }, [dispatch, token]);

    useEffect(() => {
        if (!nickname && !currentUser) return;
        dispatch(setNickName(nickname));

        const fetchApi = async () => {
            try {
                setIsLoading(true);
                let res;
                if (Object.keys(profile).length !== 0) {
                    if (profile) {
                        res = profile;
                        if (res.nickname === currentUser) {
                            dispatch(setMyAccount(true));
                        } else {
                            dispatch(setMyAccount(false));
                        }
                        dispatch(setProfile(res));
                    } else {
                        res = await getProfile(`@${currentUser}`, token);
                        if (res?.avatar) {
                            dispatch(setCurrentUserImageSlice(res?.avatar));
                        }
                        if (res?.first_name && res?.last_name) {
                            dispatch(setFullNameCurrentUser(`${res.first_name} ${res.last_name || res.nickname}`));
                        }

                        if (res?.bio && res?.likes_count && res?.followers_count) {
                            dispatch(
                                setInfoCurrentUser({
                                    bio: `${res.bio}`,
                                    followers: `${res.followers_count || '0'}`,
                                    likes: `${res.likes_count}`,
                                }),
                            );
                        }
                        if (res.nickname === currentUser) {
                            dispatch(setMyAccount(true));
                        } else {
                            dispatch(setMyAccount(false));
                        }
                    }
                    dispatch(setProfile(res));
                } else {
                    if (Object.keys(profile).length !== 0) {
                        res = profile;
                    } else {
                        res = await getProfile(nickname, token);
                    }
                    dispatch(setProfile(res));
                }
                if (res?.id) {
                    dispatch(setIdUser(res.id));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApi();
    }, [nickname, currentUser, myProfile, dispatch, token, profile]);

    return (
        <div className={cx('wrapper')}>
            <ProfileDetail isLoading={isLoading} />
            <Content isLoading={isLoading} />
        </div>
    );
}

export default Profile;
