import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';

import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import Image from '~/components/Image';
import {
    CoinIcon,
    InboxIcon,
    KeyboardIcon,
    LanguageIcon,
    LogoutIcon,
    MessageIcon,
    MoonIcon,
    QuestionIcon,
    SettingIcon,
    SubIcon,
    UserIcon,
} from '~/components/Icons';
import Search from '../Search';
import { ThemeContext } from '~/components/ThemeProvider';
import { useContext } from 'react';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <LanguageIcon />,
        title: 'English',
        children: {
            title: 'Language',
            data: [
                {
                    type: 'language',
                    code: 'vi',
                    title: 'English',
                },
                {
                    type: 'language',
                    code: 'en',
                    title: 'Vietnamese',
                },
            ],
        },
    },
    {
        icon: <QuestionIcon />,
        title: 'Feedback and help',
        to: '/feedback',
    },
    {
        icon: <KeyboardIcon />,
        title: 'Keyboard shortcut',
    },
    {
        icon: <MoonIcon />,
        title: 'Dark mode',
        children: {
            title: 'Dark mode',
            data: [
                {
                    type: 'dark',
                    title: 'Dark mode',
                },
                {
                    type: 'light',
                    title: 'Light mode',
                },
            ],
        },
    },
];

function Header() {
    const currentUser = true;

    const themeContext = useContext(ThemeContext);

    //handle logic
    const handleMenuChange = (menuItem) => {
        switch (menuItem.type) {
            case 'language':
                break;
            default:
        }
    };

    const userMenu = [
        {
            icon: <UserIcon />,
            title: 'View profile',
            to: '/@mrrain',
        },
        {
            icon: <CoinIcon />,
            title: 'Get coins',
            to: '/coin',
        },
        {
            icon: <SettingIcon />,
            title: 'Setting',
            to: '/setting',
        },
        ...MENU_ITEMS,
        {
            icon: <LogoutIcon />,
            title: 'Log out',
            to: '/logout',
            separate: true,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')}>
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
                                <button
                                    className={cx('action-btn', {
                                        'inbox-icon': true,
                                    })}
                                >
                                    <InboxIcon />
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button text>Upload</Button>
                            <Button primary>Login</Button>
                        </>
                    )}

                    <Menu items={currentUser ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
                        {currentUser ? (
                            <Image className={cx('user-avatar')} src={images.avatar} alt="Mr.Rain" />
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
