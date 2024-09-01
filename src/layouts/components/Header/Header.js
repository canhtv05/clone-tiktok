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
import { CoinIcon, InboxIcon, LogoutIcon, MessageIcon, SubIcon, UserIcon } from '~/components/Icons';
import Search from '../Search';
import { ThemeContext } from '~/components/Context/ThemeProvider';
import { useContext } from 'react';
import { getMenuItems } from './index';

const cx = classNames.bind(styles);

function Header() {
    const currentUser = true;

    const themeContext = useContext(ThemeContext);

    const MENU_ITEMS = getMenuItems(currentUser);

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
        ...MENU_ITEMS,
        {
            icon: <LogoutIcon />,
            title: 'Log out',
            to: '/logout',
            separate: true,
        },
    ];

    //handle logic
    const handleMenuChange = (menuItem) => {
        switch (menuItem.tile) {
            case 'Dark mode':
                break;
            default:
            // console.log(menuItem[selectedIndex.selectedIndex]);
        }
    };

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
                                <button className={cx('action-btn', { 'inbox-icon': true })}>
                                    <InboxIcon />
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button primary>Login</Button>
                        </>
                    )}

                    <Menu
                        items={currentUser ? userMenu : MENU_ITEMS}
                        onChange={() => handleMenuChange(currentUser ? userMenu : MENU_ITEMS)}
                    >
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
