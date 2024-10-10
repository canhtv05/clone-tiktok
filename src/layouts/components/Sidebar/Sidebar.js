import classNames from 'classnames/bind';
import { useState, useEffect, useCallback } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { useNavigate } from 'react-router-dom';
import images from '~/assets/images';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setCurrentUserImageSlice } from '~/redux/slices/currentUserImageSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';
import { setFullNameCurrentUser } from '~/redux/slices/fullNameCurrentUserSlice';
import { setInfoCurrentUser } from '~/redux/slices/infoCurrentUserSlice';
import { setProfile } from '~/redux/slices/profileSlice';

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

    const fullNameCurrentUser = useSelector((state) => state.fullNameCurrentUser.fullNameCurrentUser);

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

                    if (res?.bio && res?.likes_count && res?.followers_count) {
                        dispatch(
                            setInfoCurrentUser({
                                bio: `${res.bio}`,
                                followers: `${res.followers_count || '0'}`,
                                likes: `${res.likes_count}`,
                            }),
                        );
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

    const handleProfileClick = useCallback(
        (e) => {
            if (!currentUser) {
                e.preventDefault();
                setShowLoginForm(true);
                return;
            }
            document.title = `${fullNameCurrentUser} (@${user}) | TikTok`;
            dispatch(setProfile({}));
            dispatch(setMyAccount(true));
            // dispatch(setNickName(`@${user}`));
            navigate(`/profile/@${user}`);
        },
        [currentUser, dispatch, navigate, user, fullNameCurrentUser],
    );

    const handleCloseLoginForm = () => {
        setShowLoginForm(false);
    };

    const handleReLoadProfile = (title) => {
        dispatch(setProfile({}));
        switch (title) {
            case 'For you': {
                document.title = 'TikTok - Make Your Day';
                break;
            }
            case 'Explore': {
                document.title = 'Explore - Find your favourite videos on TikTok';
                break;
            }
            case 'Following': {
                document.title = 'Following - Watch videos from creators you follow | TikTok';
                break;
            }
            case 'LIVE': {
                document.title = 'For You - TikTok LIVE feed';
                break;
            }
            default: {
                document.title = 'TikTok - Make Your Day';
            }
        }
    };

    const menuItems = [
        {
            title: 'For you',
            to: config.routes.home,
            icon: <HomeIcon />,
            activeIcon: <HomeActiveIcon />,
            onClick: () => handleReLoadProfile('For you'),
        },
        {
            title: 'Explore',
            to: config.routes.explore,
            icon: <ExploreIcon />,
            activeIcon: <ExploreActiveIcon />,
            onClick: () => handleReLoadProfile('Explore'),
        },
        {
            title: 'Following',
            to: config.routes.following,
            icon: <UserGroupIcon />,
            activeIcon: <UserGroupActiveIcon />,
            onClick: () => handleReLoadProfile('Following'),
        },
        {
            title: 'LIVE',
            to: config.routes.live,
            icon: <LiveIcon />,
            activeIcon: <LiveActiveIcon />,
            onClick: () => handleReLoadProfile('LIVE'),
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
