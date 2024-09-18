import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { getProfile } from '~/services/getProfile';
import styles from './Sidebar.module.scss';
import config from '~/config';
import {
    HomeIcon,
    HomeActiveIcon,
    UserGroupIcon,
    UserGroupActiveIcon,
    LiveIcon,
    LiveActiveIcon,
    ExploreIcon,
    ExploreActiveIcon,
    ProfileIcon,
} from '~/components/Icons';
import Menu, { MenuItem } from './Menu';
import SuggestAccounts from './SuggestAccounts';
import FollowingAccounts from './FollowingAccounts';
import SidebarFooter from './SidebarFooter';
import Image from '~/components/Image';
import NoLogin from './NoLogin/NoLogin';
import LoginForm from '~/components/LoginForm';
import { useDispatch } from 'react-redux';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { useNavigate } from 'react-router-dom';
import images from '~/assets/images';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setCurrentUserImageSlice } from '~/redux/slices/currentUserImageSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';
import { setFullNameCurrentUser } from '~/redux/slices/fullNameCurrentUserSlice';

const cx = classNames.bind(styles);

const renderProfileIcon = (avatar, isCurrentUser) =>
    isCurrentUser ? (
        <Image style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%' }} src={avatar} alt="Profile" />
    ) : (
        <ProfileIcon />
    );

const Sidebar = () => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const [currentUser, setCurrentUser] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const storedUser = localStorage.getItem('user');

            const fetchApi = async () => {
                if (storedUser) {
                    setCurrentUser(JSON.parse(storedUser));
                } else {
                    const res = await getProfile(`@${user}`);
                    if (res?.id) {
                        dispatch(setIdUser(res.id));
                    }
                    if (res?.data?.avatar) {
                        dispatch(setCurrentUserImageSlice(res.avatar));
                    }

                    if (res?.first_name && res?.last_name) {
                        dispatch(setFullNameCurrentUser(`${res.first_name} ${res.last_name || res.nickname}`));
                    }

                    localStorage.setItem('user', JSON.stringify(res));
                    setCurrentUser(res);
                }
            };
            fetchApi();
        } else {
            setCurrentUser(null);
            localStorage.removeItem('user');
        }
    }, [user, dispatch]);

    const handleProfileClick = (e) => {
        if (!currentUser) {
            e.preventDefault();
            setShowLoginForm(true);
            return;
        }
        dispatch(setMyAccount(true));
        dispatch(setNickName(`@${user}`));
        navigate(`/profile/@${user}`);
    };

    const handleCloseLoginForm = () => {
        setShowLoginForm(false);
    };

    const menuItems = [
        {
            title: 'For you',
            to: config.routes.home,
            icon: <HomeIcon />,
            activeIcon: <HomeActiveIcon />,
        },
        {
            title: 'Explore',
            to: config.routes.explore,
            icon: <ExploreIcon />,
            activeIcon: <ExploreActiveIcon />,
        },
        {
            title: 'Following',
            to: config.routes.following,
            icon: <UserGroupIcon />,
            activeIcon: <UserGroupActiveIcon />,
        },
        {
            title: 'LIVE',
            to: config.routes.live,
            icon: <LiveIcon />,
            activeIcon: <LiveActiveIcon />,
        },
        {
            title: 'Profile',
            to: `/profile/@${user}`,
            icon: renderProfileIcon(currentUser?.avatar || images.noImage, currentUser),
            activeIcon: renderProfileIcon(currentUser?.avatar || images.noImage, currentUser),
            onClick: handleProfileClick,
        },
    ];

    return (
        <aside className={cx('wrapper')}>
            <Menu>
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        title={item.title}
                        to={item.to}
                        icon={item.icon}
                        activeIcon={item.activeIcon}
                        tabIndex={-1}
                        onClick={item.onClick}
                    />
                ))}
            </Menu>

            {user && (
                <>
                    <SuggestAccounts label="Suggested Account" />
                    <FollowingAccounts label="Following Account" />
                </>
            )}
            {!user && <NoLogin />}
            <SidebarFooter />
            {!user && showLoginForm && <LoginForm onClose={handleCloseLoginForm} />}
        </aside>
    );
};

export default Sidebar;
