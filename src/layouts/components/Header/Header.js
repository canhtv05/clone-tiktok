import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import ModalSuccess from '~/components/LoginForm/ModalSuccessLogin';
import { setLoginSuccess } from '~/redux/slices/loginSuccessSlice';
import { getProfile } from '~/services/getProfile';

const cx = classNames.bind(styles);

function Header() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(true);
    const [showModalSuccess, setShowModalSuccess] = useState(false);

    const user = useSelector((state) => state.currentUser.currentUser);
    const loginSuccess = useSelector((state) => state.successLogin.successLogin);
    const themeContext = useContext(ThemeContext);
    const dispatch = useDispatch();

    const MENU_ITEMS = useMemo(() => getMenuItems(user), [user]);
    const userMenu = useMemo(
        () => [
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
        ],
        [user, MENU_ITEMS],
    );

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        if (loginSuccess) {
            setShowModalSuccess(true);
            const timer = setTimeout(() => {
                setShowModalSuccess(false);
                dispatch(setLoginSuccess(false));
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [dispatch, loginSuccess]);

    useEffect(() => {
        if (user) {
            const fetchApi = async () => {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setCurrentUser(JSON.parse(storedUser));
                } else {
                    const res = await getProfile(`@${user}`);
                    setCurrentUser(res);
                    localStorage.setItem('user', JSON.stringify(res));
                }
            };
            fetchApi();
        } else {
            setCurrentUser(null);
            localStorage.removeItem('user');
        }
    }, [user]);

    const handleMenuChange = (menuItem) => {
        switch (menuItem.title) {
            case 'View profile':
                dispatch(setMyAccount(true));
                break;
            case 'English':
                break;
            default:
        }
    };

    const handleLoginClick = () => {
        setShowLoginForm(true);
    };

    const handleCloseLoginForm = () => {
        setShowLoginForm(false);
    };

    const handleLoginSuccess = () => {
        dispatch(setLoginSuccess(true));
    };

    return (
        <header className={cx('wrapper')}>
            {showLoginForm && (
                <>
                    <div onClick={handleCloseLoginForm}></div>
                    {ReactDOM.createPortal(
                        <LoginForm onClose={handleCloseLoginForm} onLoginSuccess={handleLoginSuccess} />,
                        document.body,
                    )}
                </>
            )}
            {showModalSuccess && <ModalSuccess />}
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')} tabIndex={-1}>
                    <Image src={themeContext.isDark ? images.logoLight : images.logoDark} alt="TikTok" />
                </Link>
                <Search />
                <div className={cx('actions')}>
                    {user ? (
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
                    {user && (
                        <Menu items={userMenu} onChange={(userMenu, index) => handleMenuChange(userMenu, index)}>
                            {currentUser ? (
                                <Image
                                    className={cx('user-avatar')}
                                    src={currentUser.avatar || images.noImage}
                                    alt={currentUser.nickname}
                                />
                            ) : (
                                <button className={cx('more-btn')}>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </button>
                            )}
                        </Menu>
                    )}
                    {!user && (
                        <Menu items={MENU_ITEMS} onChange={(MENU_ITEMS, index) => handleMenuChange(MENU_ITEMS, index)}>
                            {currentUser ? (
                                <Image
                                    className={cx('user-avatar')}
                                    src={currentUser.avatar}
                                    alt={currentUser.nickname}
                                />
                            ) : (
                                <button className={cx('more-btn')}>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </button>
                            )}
                        </Menu>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
