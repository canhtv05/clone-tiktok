import classNames from 'classnames/bind';
import styles from './FooterPageNotFound.module.scss';
import Button from '~/components/Button';
import Image from '~/components/Image';
import { DropDownIcon, QrCodeIcon } from '~/components/Icons';
import images from '~/assets/images';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '~/components/Context/ThemeProvider';
import { Wrapper as PopperWrapper } from '~/components/Popper';

const cx = classNames.bind(styles);

const listContact = [
    {
        title: 'Company',
        content: [
            {
                desc: 'About',
                to: '/',
            },
            {
                desc: 'Newsroom',
                to: '/',
            },
            {
                desc: 'Contact',
                to: '/',
            },
            {
                desc: 'Careers',
                to: '/',
            },
        ],
    },
    {
        title: 'Programs',
        content: [
            {
                desc: 'TikTok for Good',
                to: '/',
            },
            {
                desc: 'Advertise',
                to: '/',
            },
            {
                desc: 'TikTok LIVE Creator',
                to: '/',
            },
            {
                desc: 'Networks',
                to: '/',
            },
            {
                desc: 'Developers',
                to: '/',
            },
            {
                desc: 'Transparency',
                to: '/',
            },
            {
                desc: 'TikTok Rewards',
                to: '/',
            },
            {
                desc: 'TikTok Embeds',
                to: '/',
            },
        ],
    },
    {
        title: 'Support',
        content: [
            {
                desc: 'Help Center',
                to: '/',
            },
            {
                desc: 'Safety Center',
                to: '/',
            },
            {
                desc: 'Privacy Center',
                to: '/',
            },
            {
                desc: 'Creator Portal',
                to: '/',
            },
            {
                desc: 'Community Guidelines',
                to: '/',
            },
            {
                desc: 'Transparency',
                to: '/',
            },
            {
                desc: 'Accessibility',
                to: '/',
            },
        ],
    },
    {
        title: 'Legal',
        content: [
            {
                desc: 'Terms of Use',
                to: '/',
            },
            {
                desc: 'Privacy Policy',
                to: '/',
            },
        ],
    },
];

const listLang = [
    {
        code: 'vi-VN',
        lang: 'Tiếng Việt',
        separate: true,
    },
    {
        code: 'ar',
        lang: 'العربية',
        separate: true,
    },
    {
        code: 'bn-IN',
        lang: 'বাঙ্গালি (ভারত)',
        separate: true,
    },
    {
        code: 'ceb-PH',
        lang: 'Cebuano (Pilipinas)',
        separate: true,
    },
    {
        code: 'cs-CZ',
        lang: 'Čeština (Česká republika)',
        separate: true,
    },
    {
        code: 'de-DE',
        lang: 'Deutsch',
        separate: true,
    },
    {
        code: 'el-GR',
        lang: 'Ελληνικά (Ελλάδα)',
        separate: true,
    },
    {
        code: 'ar',
        lang: 'العربية',
        separate: true,
    },
    {
        code: 'en',
        lang: 'English',
        separate: true,
    },
    {
        code: 'es',
        lang: 'Español',
        separate: true,
    },
    {
        code: 'fi-FI',
        lang: 'Suomi (Suomi)',
        separate: true,
    },
    {
        code: 'fr',
        lang: 'Français',
        separate: true,
    },
    {
        code: 'he-IL',
        lang: 'עברית (ישראל)',
        separate: true,
    },
    {
        code: 'hi-IN',
        lang: 'हिंदी',
        separate: true,
    },
    {
        code: 'hu-HU',
        lang: 'Magyar (Magyarország)',
        separate: true,
    },
    {
        code: 'id-ID',
        lang: 'Bahasa Indonesia (Indonesia)',
        separate: true,
    },
    {
        code: 'it-IT',
        lang: 'Italiano (Italia)',
        separate: true,
    },
    {
        code: 'ja-JP',
        lang: '日本語（日本)',
        separate: true,
    },
    {
        code: 'jv-ID',
        lang: 'Basa Jawa (Indonesia)',
        separate: true,
    },
    {
        code: 'km-KH',
        lang: 'ខ្មែរ (កម្ពុជា)',
        separate: true,
    },
    {
        code: 'ko-KR',
        lang: '한국어 (대한민국)',
        separate: true,
    },
    {
        code: 'ms-MY',
        lang: 'Bahasa Melayu (Malaysia)',
        separate: true,
    },
    {
        code: 'my-MM',
        lang: 'မြန်မာ (မြန်မာ)',
        separate: true,
    },
    {
        code: 'nl-NL',
        lang: 'Nederlands (Nederland)',
        separate: true,
    },
];

function FooterPageNotFound() {
    const { isDark } = useContext(ThemeContext);
    const [isClickDropdown, setIsClickDropdown] = useState(false);

    useEffect(() => {
        document.title = 'TikTok';
        const iconRef = dropdownRef.current;
        if (isClickDropdown) {
            iconRef.style.transform = 'rotate(-180deg)';
        } else {
            iconRef.style.transform = 'rotate(0deg)';
        }
    }, [isClickDropdown]);

    const dropdownRef = useRef();
    const currentLang = useRef();
    const divDropdown = useRef();

    const handleRotate = () => {
        setIsClickDropdown((prev) => !prev);
    };

    const handleCurrentLang = (e, language) => {
        e.stopPropagation();
        setIsClickDropdown(false);
        currentLang.current.innerText = language;
    };

    const handleClickOutsidePopper = (event) => {
        if (divDropdown.current && !divDropdown.current.contains(event.target)) {
            setIsClickDropdown(false);
        }
    };

    return (
        <div className={cx('container')} onMouseDown={handleClickOutsidePopper}>
            <div className={cx('container-download')}>
                <div className={cx('wrapper')}>
                    <p className={cx('title-download')}>Download now</p>
                    <div className={cx('link-download')}>
                        <Button
                            className={cx('button-download', { 'qr-code': true })}
                            to={'/'}
                            leftIcon={<QrCodeIcon style={{ color: 'var(--white)' }} />}
                        >
                            <span style={{ color: 'var(--white)' }}>QR CODE</span>
                        </Button>
                        <Button className={cx('button-download', { 'no-padding': true })} to={'/'}>
                            <Image className={cx('logo-microsoft')} src={images.logoMicrosoft} />
                        </Button>
                        <Button className={cx('button-download', { 'app-store': true })} to={'/'}></Button>
                        <Button className={cx('button-download', { amazon: true })} to={'/'}></Button>
                        <Button className={cx('button-download', { 'google-play': true })} to={'/'}></Button>
                    </div>
                </div>
            </div>
            <footer className={cx('footer-wrapper')}>
                <div className={cx('logo-tiktok')}>
                    <Image src={isDark ? images.logoLight : images.logoDark} />
                </div>
                {listContact.map((item, index) => (
                    <div className={cx('container-contact')} key={index}>
                        <h4 className={cx('title')}>{item.title}</h4>
                        {item.content.map((item, index) => (
                            <Link to={item.to} key={index} className={cx('link-to')}>
                                <span>{item.desc}</span>
                            </Link>
                        ))}
                    </div>
                ))}
            </footer>
            <div className={cx('bottom-wrapper')}>
                <div className={cx('lang-selection-container')} onClick={handleRotate}>
                    {isClickDropdown && (
                        <PopperWrapper className={cx('select-lang')} ref={divDropdown}>
                            {listLang.map((item, index) => (
                                <div
                                    value={item.code}
                                    key={index}
                                    className={cx('item-lang', { separate: item.separate })}
                                    onClick={(e) => handleCurrentLang(e, item.lang)}
                                >
                                    <span className={cx('name-lang')}>{item.lang}</span>
                                </div>
                            ))}
                        </PopperWrapper>
                    )}
                    <p className={cx('panel-lang')} ref={currentLang}>
                        English
                    </p>
                    <span ref={dropdownRef} className={cx('dropdown-icon')}>
                        <DropDownIcon />
                    </span>
                </div>

                <div className={cx('copy-right')}>
                    <span>© 2024 TikTok - Copyright Canhtv05</span>
                </div>
            </div>
        </div>
    );
}

export default FooterPageNotFound;
