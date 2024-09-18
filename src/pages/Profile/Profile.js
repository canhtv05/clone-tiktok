import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import ProfileDetail from './ProfileDetail';
import Content from './Content';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getProfile } from '~/services/getProfile';
import { setCurrentUserImageSlice } from '~/redux/slices/currentUserImageSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';
import { setFullNameCurrentUser } from '~/redux/slices/fullNameCurrentUserSlice';

const cx = classNames.bind(styles);

function Profile() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const nickname = useSelector((state) => state.getNickname.nickname);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const myProfile = useSelector((state) => state.myAccount.myAccount);

    const [data, setData] = useState({});

    useEffect(() => {
        if (!nickname && !currentUser) return;

        const fetchApi = async () => {
            setIsLoading(true);
            try {
                let res;
                if (myProfile) {
                    res = await getProfile(`@${currentUser}`);
                    if (res?.avatar) {
                        dispatch(setCurrentUserImageSlice(res?.avatar));
                    }
                    if (res?.first_name && res?.last_name) {
                        dispatch(setFullNameCurrentUser(`${res.first_name} ${res.last_name || res.nickname}`));
                    }
                } else {
                    res = await getProfile(nickname);
                }
                if (res?.data?.id) {
                    dispatch(setIdUser(res.data.id));
                }

                setData(res);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApi();
    }, [nickname, currentUser, myProfile, dispatch]);

    return (
        <div className={cx('wrapper')}>
            <ProfileDetail data={data} isLoading={isLoading} />
            <Content data={data} isLoading={isLoading} />
        </div>
    );
}

export default Profile;
