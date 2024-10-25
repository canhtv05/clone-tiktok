import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { setProfile } from '~/redux/slices/profileSlice';
import LoginModal from '~/components/LoginForm';
import { setPreviousLocation } from '~/redux/slices/previousLocationSlice';

const cx = classNames.bind(styles);

function Header() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.currentUser.currentUser);
    const fullNameCurrentUser = useSelector((state) => state.fullNameCurrentUser.fullNameCurrentUser);
    const currentUserImage = useSelector((state) => state.currentUserImage.currentUserImage);
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

    const Avatar = useCallback(() => {
        return (
            token &&
            user && (
                <Menu items={userMenu} onChange={(userMenu, index) => handleMenuChange(userMenu, index)}>
                    {currentUserImage && fullNameCurrentUser ? (
                        <Image className={cx('user-avatar')} src={currentUserImage} alt={fullNameCurrentUser} />
                    ) : (
                        <div className={cx('user-avatar')}></div>
                    )}
                </Menu>
            )
        );
    }, [currentUserImage, fullNameCurrentUser, token, handleMenuChange, user, userMenu]);

    const handleNavigate = useCallback(
        (e) => {
            const currentToken = localStorage.getItem('token');
            if (!currentToken) {
                navigate('/following');
                // e.preventDefault();
            }
            dispatch(setPreviousLocation(location.pathname));
        },
        [location, dispatch, navigate],
    );

    return (
        <header className={cx('wrapper')}>
            <LoginModal isShowModalLoginForm={showLoginForm} setIsShowModalLoginForm={setShowLoginForm} />
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
                                    <Link to={'/messages'} onClick={handleNavigate}>
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
                    {token && !user && <div className={cx('user-avatar')}></div>}
                    <Avatar />
                    {!token && (
                        <Menu items={MENU_ITEMS} onChange={(MENU_ITEMS, index) => handleMenuChange(MENU_ITEMS, index)}>
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        </Menu>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
