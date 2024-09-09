import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';

import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import Image from '~/components/Image';
import { CoinIcon, InboxIcon, LogoutIcon, MessageIcon, SubIcon, UserIcon } from '~/components/Icons';
import Search from '../Search';
import { ThemeContext } from '~/components/Context/ThemeProvider';
import { useContext } from 'react';
import { getMenuItems } from './index';
import LoginForm from '~/components/LoginForm';
import { useSelector } from 'react-redux';
import { getProfile } from '~/services/getProfile';

const cx = classNames.bind(styles);

function Header() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const user = useSelector((state) => state.currentUser.currentUser);

    const themeContext = useContext(ThemeContext);

    const MENU_ITEMS = getMenuItems(user);

    const userMenu = [
        {
            icon: <UserIcon />,
            title: 'View profile',
            to: `/profile/@${user}`,
        },
        {
            icon: <CoinIcon />,
            title: 'Get coins',
            to: '/coin',
        },
        ...MENU_ITEMS,
        {
            icon: <LogoutIcon />,
            title: 'Log out',
            to: '/logout',
            separate: true,
        },
    ];

    //getCurrentUser
    useEffect(() => {
        if (user) {
            const fetchApi = async () => {
                const res = await getProfile(`@${user}`);
                setCurrentUser(res);
            };
            fetchApi();
        } else {
            setCurrentUser(null);
        }
    }, [user]);

    //handle logic
    const handleMenuChange = (menuItem) => {
        // switch (menuItem.tile) {
        //     case 'Dark mode':
        //         console.log(menuItem.title);
        //         break;
        //     default:
        // }

        console.log(menuItem);
    };

    const handleLoginClick = () => {
        setShowLoginForm(true);
    };

    const handleCloseLoginForm = () => {
        setShowLoginForm(false);
    };

    return (
        <header className={cx('wrapper')}>
            {showLoginForm && (
                <>
                    <div className="overlay" onClick={handleCloseLoginForm}></div>
                    {ReactDOM.createPortal(<LoginForm onClose={handleCloseLoginForm} />, document.body)}
                </>
            )}
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')} tabIndex={-1}>
                    <Image src={themeContext.isDark ? images.logoLight : images.logoDark} alt="TikTok" />
                </Link>
                <Search />
                <div className={cx('actions')}>
                    {currentUser ? (
                        <>
                            <Button
                                className={cx('upload')}
                                upload
                                outline
                                to={'/upload'}
                                leftIcon={<SubIcon className={cx('sub-icon')} />}
                            >
                                Upload
                            </Button>
                            <Tippy delay={[0, 200]} content={'Messages'} placement="bottom">
                                <button className={cx('action-btn')}>
                                    <MessageIcon />
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 200]} content={'Inbox'} placement="bottom">
                                <button className={cx('action-btn', { 'inbox-icon': true })}>
                                    <InboxIcon />
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleLoginClick} className={cx('login')} primary>
                                Log in
                            </Button>
                        </>
                    )}

                    <Menu items={userMenu} onChange={() => handleMenuChange(userMenu)}>
                        {currentUser ? (
                            <Image className={cx('user-avatar')} src={currentUser.avatar} alt={currentUser.nickname} />
                        ) : (
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default Header;
