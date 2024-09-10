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
    const currentUser = useSelector((state) => state.currentUser.currentUser);
    // click vao profile
    const myProfile = useSelector((state) => state.myAccount.myAccount);

    const [data, setData] = useState({});

    useEffect(() => {
        if (!nickname && !currentUser) return;

        const fetchApi = async () => {
            setIsLoading(true);
            let res;

            if (myProfile) {
                res = await getProfile(`@${currentUser}`);
            } else {
                res = await getProfile(nickname);
            }

            const timeout = setTimeout(() => {
                setData(res);
                setIsLoading(false);
            }, 200);

            return () => clearTimeout(timeout);
        };

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
