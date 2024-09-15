import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import ProfileDetail from './ProfileDetail';
import Content from './Content';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getProfile } from '~/services/getProfile';

const cx = classNames.bind(styles);

function Profile() {
    const [isLoading, setIsLoading] = useState(false);
    const nickname = useSelector((state) => state.getNickname.nickname);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const myProfile = useSelector((state) => state.myAccount.myAccount);

    const [data, setData] = useState({});

    useEffect(() => {
        if (!nickname && !currentUser) return;

        const newProfileKey = myProfile ? `@${currentUser}` : nickname;

        const fetchApi = async () => {
            setIsLoading(true);

            try {
                const cachedData = localStorage.getItem(`profile-${newProfileKey}`);
                if (cachedData) {
                    setData(JSON.parse(cachedData));
                    setIsLoading(false);
                    return;
                }

                const res = await getProfile(newProfileKey);
                setData(res);

                localStorage.setItem(`profile-${newProfileKey}`, JSON.stringify(res));
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        const keysToRemove = Object.keys(localStorage).filter(
            (key) => key.startsWith('profile-') && key !== `profile-${newProfileKey}`,
        );
        keysToRemove.forEach((key) => localStorage.removeItem(key));

        fetchApi();
    }, [nickname, currentUser, myProfile]);

    return (
        <div className={cx('wrapper')}>
            <ProfileDetail data={data} isLoading={isLoading} />
            <Content data={data} isLoading={isLoading} />
        </div>
    );
}

export default Profile;
