import classNames from 'classnames/bind';
import { useState, useCallback, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { useNavigate, useParams } from 'react-router-dom';
import images from '~/assets/images';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setProfile } from '~/redux/slices/profileSlice';
import LoginModal from '~/components/LoginForm/LoginModal';
import { setCurrentUser } from '~/redux/slices/currentUserSlice';
import { setCurrentUserImageSlice } from '~/redux/slices/currentUserImageSlice';

const cx = classNames.bind(styles);

const renderProfileIcon = (avatar, isCurrentUser) =>
    isCurrentUser ? (
        <Image style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%' }} src={avatar} alt="Profile" />
    ) : (
        <ProfileIcon />
    );

const Sidebar = () => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const user = useSelector((state) => state.currentUser.currentUser);
    const token = localStorage.getItem('token');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.currentUser.currentUser);
    const currentUserImage = useSelector((state) => state.currentUserImage.currentUserImage);

    useEffect(() => {
        if (!token) {
            dispatch(setCurrentUser(null));
            dispatch(setCurrentUserImageSlice(''));
        }
    }, [dispatch, token]);

    const { nickname } = useParams();

    const fullNameCurrentUser = useSelector((state) => state.fullNameCurrentUser.fullNameCurrentUser);

    const handleProfileClick = useCallback(
        (e) => {
            if (!currentUser) {
                e.preventDefault();
                setShowLoginForm(true);
                return;
            }
            document.title = `${fullNameCurrentUser} (@${user}) | TikTok`;
            if (nickname !== `@${user}`) {
                dispatch(setProfile({}));
            }
            dispatch(setMyAccount(true));
            dispatch(setNickName(`@${user}`));
            navigate(`/profile/@${user}`);
        },
        [currentUser, dispatch, navigate, user, fullNameCurrentUser, nickname],
    );

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
            icon: renderProfileIcon(currentUserImage || images.noImage, currentUser),
            activeIcon: renderProfileIcon(currentUserImage || images.noImage, currentUser),
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

            {token && (
                <>
                    <SuggestAccounts label="Suggested Account" />
                    <FollowingAccounts label="Following Account" />
                </>
            )}
            {!token && <NoLogin />}
            <SidebarFooter />
            <LoginModal isShowModalLoginForm={showLoginForm} setIsShowModalLoginForm={setShowLoginForm} />
        </aside>
    );
};

export default Sidebar;
