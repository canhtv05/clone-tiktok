import classNames from 'classnames/bind';
import { useState } from 'react';
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
import images from '~/assets/images';
import Image from '~/components/Image';
import NoLogin from './NoLogin/NoLogin';
import LoginForm from '~/components/LoginForm';

const cx = classNames.bind(styles);

const renderProfileIcon = (avatar, isCurrentUser) =>
    isCurrentUser ? (
        <Image style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%' }} src={avatar} alt="Profile" />
    ) : (
        <ProfileIcon />
    );

const Sidebar = () => {
    const [showLoginForm, setShowLoginForm] = useState(false);

    const handleProfileClick = (e) => {
        if (!currentUser) {
            e.preventDefault();
            setShowLoginForm(true);
        }
    };

    const handleCloseLoginForm = () => {
        setShowLoginForm(false);
    };

    const currentUser = false;

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
            to: config.routes.profile,
            icon: renderProfileIcon(images.avatar, currentUser),
            activeIcon: renderProfileIcon(images.avatar, currentUser),
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

            {currentUser && (
                <>
                    <SuggestAccounts label="Suggested Account" />
                    <FollowingAccounts label="Following Account" />
                </>
            )}
            {!currentUser && <NoLogin />}
            <SidebarFooter />
            {!currentUser && showLoginForm && <LoginForm onClose={handleCloseLoginForm} />}
        </aside>
    );
};

export default Sidebar;
