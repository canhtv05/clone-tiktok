import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './SidebarFooter.module.scss';
import Image from '~/components/Image';
import images from '~/assets/images';
import routes from '~/config/routes';
import { useCallback, useState } from 'react';

const cx = classNames.bind(styles);

const listCompany = [
    {
        title: 'About',
        to: '/',
    },
    {
        title: 'Newsroom',
        to: '/',
    },
    {
        title: 'Contact',
        to: '/',
    },
    {
        title: 'Careers',
        to: '/',
    },
];

const listProgram = [
    {
        title: 'TikTok for Good',
        to: '/',
    },
    {
        title: 'Advertise',
        to: '/',
    },
    {
        title: 'TikTok LIVE Creator Networks',
        to: '/',
    },
    {
        title: 'Developers',
        to: '/',
    },
    {
        title: 'Transparency',
        to: '/',
    },
    {
        title: 'TikTok Rewards',
        to: '/',
    },
    {
        title: 'TikTok Embeds',
        to: '/',
    },
];

const listPolices = [
    {
        title: 'Help',
        to: '/',
    },
    {
        title: 'Safety',
        to: '/',
    },
    {
        title: 'Terms',
        to: '/',
    },
    {
        title: 'Privacy Policy',
        to: '/',
    },
    {
        title: 'Accessibility',
        to: '/',
    },
    {
        title: 'Privacy Center',
        to: '/',
    },
    {
        title: 'Creator Academy',
        to: '/',
    },
    {
        title: 'Community Guidelines',
        to: '/',
    },
];

function SidebarFooter() {
    const [toggle, setToggle] = useState(false);
    const [type, setType] = useState('');

    const handleClick = useCallback((type) => {
        setType((prev) => {
            if (prev === type) {
                setToggle((togglePrev) => !togglePrev);
            } else {
                setToggle(true);
            }
            return type;
        });
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-icon')}>
                <Link to={routes.home} tabIndex={-1}>
                    <Image src={images.footerSidebar} className={cx('icon')} />
                    <div className={cx('wrapper-title')}>
                        <h4 className={cx('title')}>Create TikTok effects, get a reward</h4>
                    </div>
                </Link>
            </div>
            <h4
                className={cx('company', { active: toggle && type === 'company' })}
                onClick={() => handleClick('company')}
            >
                Company
                {toggle && type === 'company' && (
                    <div className={cx('list-link')}>
                        {listCompany.map((item, index) => (
                            <Link key={index} className={cx('list-item')} href={item.to}>
                                {item.title}
                            </Link>
                        ))}
                    </div>
                )}
            </h4>
            <h4
                className={cx('program', { active: toggle && type === 'program' })}
                onClick={() => handleClick('program')}
            >
                Program
                {toggle && type === 'program' && (
                    <div className={cx('list-link')}>
                        {listProgram.map((item, index) => (
                            <Link key={index} className={cx('list-item')} href={item.to}>
                                {item.title}
                            </Link>
                        ))}
                    </div>
                )}
            </h4>
            <h4
                className={cx('polices', { active: toggle && type === 'polices' })}
                onClick={() => handleClick('polices')}
            >
                Terms & Polices
                {toggle && type === 'polices' && (
                    <div className={cx('list-link')}>
                        {listPolices.map((item, index) => (
                            <Link key={index} className={cx('list-item')} href={item.to}>
                                {item.title}
                            </Link>
                        ))}
                    </div>
                )}
            </h4>
            <span className={cx('copy-right')}>© 2024 TikTok - Copyright by Canhtv05</span>
        </div>
    );
}

export default SidebarFooter;
