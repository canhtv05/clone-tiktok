import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import Image from '~/components/Image';
import { CoinIcon, InboxIcon, LogoutIcon, MessageFill2Icon, MessageIcon, SubIcon, UserIcon } from '~/components/Icons';
import Search from '../Search';
import { ThemeContext } from '~/components/Context/ThemeProvider';
import { useContext } from 'react';
import { getMenuItems } from './index';
import LoginForm from '~/components/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import ModalSuccess from '~/components/ModalSuccess';
import { setLoginSuccess } from '~/redux/slices/loginSuccessSlice';
import { getProfile } from '~/services/getProfile';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setCurrentUserImageSlice } from '~/redux/slices/currentUserImageSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';
import { setFullNameCurrentUser } from '~/redux/slices/fullNameCurrentUserSlice';
import { setInfoCurrentUser } from '~/redux/slices/infoCurrentUserSlice';
import { setProfile } from '~/redux/slices/profileSlice';

const cx = classNames.bind(styles);

function Header() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(true);
    const [showModalSuccess, setShowModalSuccess] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.currentUser.currentUser);
    const loginSuccess = useSelector((state) => state.successLogin.successLogin);
    const fullNameCurrentUser = useSelector((state) => state.fullNameCurrentUser.fullNameCurrentUser);
    const themeContext = useContext(ThemeContext);
    const location = useLocation();
    const token = localStorage.getItem('token');

    const { nickname } = useParams();

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
        if (user) {
            setCurrentUser(user);
        }

        if (loginSuccess) {
            setShowModalSuccess(true);
            const timer = setTimeout(() => {
                setShowModalSuccess(false);
                dispatch(setLoginSuccess(false));
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [dispatch, loginSuccess, user]);

    useEffect(() => {
        if (user && token) {
            const fetchApi = async () => {
                const res = await getProfile(`@${user}`, token);
                if (res?.id) {
                    dispatch(setIdUser(res.id));
                }
                if (res?.avatar) {
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

                setCurrentUser(res);
            };
            fetchApi();
        } else {
            setCurrentUser(null);
        }
    }, [user, dispatch, token]);

    const handleMenuChange = useCallback(
        (menuItem) => {
            switch (menuItem.title) {
                case 'View profile':
                    document.title = `${fullNameCurrentUser} (@${user}) | TikTok`;
                    if (nickname !== `@${user}`) {
                        dispatch(setProfile({}));
                    }
                    dispatch(setMyAccount(true));
                    dispatch(setNickName(`@${user}`));
                    break;
                case 'English':
                    break;
                default:
            }
        },
        [dispatch, fullNameCurrentUser, nickname, user],
    );

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
            {showModalSuccess && <ModalSuccess title="Log in" />}
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')} tabIndex={-1}>
                    <Image src={themeContext.isDark ? images.logoLight : images.logoDark} alt="TikTok" />
                </Link>
                <Search />
                <div className={cx('actions')}>
                    {token ? (
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
                                    <Link to={'/messages'}>
                                        {location.pathname === '/messages' ? <MessageFill2Icon /> : <MessageIcon />}
                                    </Link>
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
                    {!token && (
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
