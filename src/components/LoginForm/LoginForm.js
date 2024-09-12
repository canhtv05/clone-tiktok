import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './LoginForm.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
    AppleIcon,
    CloseIcon,
    FBIcon,
    GoogleIcon,
    KaKaoIcon,
    LineIcon,
    QrCodeIcon,
    TwitterIcon,
    UserIcon,
} from '../Icons';
import Button from '../Button';
import LoginFormItem from './LoginFormItem';

const cx = classNames.bind(styles);

const menuItem = [
    {
        title: 'Use QR code',
        disable: true,
        icon: <QrCodeIcon />,
    },
    {
        title: 'Use phone / email/ username',
        icon: <UserIcon />,
        disable: false,
    },
    {
        title: 'Continue with Facebook',
        disable: true,
        icon: <FBIcon />,
    },
    {
        title: 'Continue with Google',
        disable: true,
        icon: <GoogleIcon />,
    },
    {
        title: 'Continue with Twitter',
        disable: true,
        icon: <TwitterIcon />,
    },
    {
        title: 'Continue with Line',
        disable: true,
        icon: <LineIcon />,
    },
    {
        title: 'Continue with KaKaoTalk',
        disable: true,
        icon: <KaKaoIcon />,
    },
    {
        title: 'Continue with Apple',
        disable: true,
        icon: <AppleIcon />,
    },
];

function LoginForm({ onClose, onLoginSuccess }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleMenuClick = (item) => {
        if (!item.disable) {
            setSelectedItem(item);
        }
    };

    const handleCloseAllModals = () => {
        setSelectedItem(null);
        onClose();
    };

    const handleBackToLogin = () => {
        setSelectedItem(null);
    };

    const handleLoginSuccess = () => {
        if (onLoginSuccess) {
            onLoginSuccess();
        }
        handleCloseAllModals();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('overlay')} onClick={onClose}></div>
            <div className={cx('login-container')}>
                <div className={cx('modal-content')}>
                    <div className={cx('div-login')}>
                        <div className={cx('div-home-container')}>
                            <h2 className={cx('login-title')}>Log in to TikTok</h2>
                            <div className={cx('login-option')}>
                                {menuItem.map((menu, index) => (
                                    <div
                                        key={index}
                                        className={cx('div-box-container', { disable: menu.disable })}
                                        onClick={() => handleMenuClick(menu)}
                                    >
                                        <span className={cx('icon')}>{menu.icon}</span>
                                        <div className={cx('div-text-container')}>{menu.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={cx('policy-confirm')}>
                        <p className={cx('text')}>
                            By continuing with an account located in
                            <Link to={'/'} className={cx('link')}>
                                <strong>{' VietNam'}</strong>
                            </Link>
                            , you agree to our
                            <Link to={'/'} className={cx('link')}>
                                <strong>{' Terms of Service '}</strong>
                            </Link>
                            and acknowledge that you have read our
                            <Link to={'/'} className={cx('link')}>
                                <strong>{' Privacy Policy'}</strong>
                            </Link>
                        </p>
                    </div>
                    <div className={cx('register')}>
                        <div className={cx('dont-account')}>Don’t have an account?</div>
                        <Link to={'/'}>
                            <span className={cx('span-link')}>Sign up</span>
                        </Link>
                    </div>
                    {selectedItem && (
                        <LoginFormItem
                            onClose={handleCloseAllModals}
                            onBack={handleBackToLogin}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    )}
                </div>
                <Button onClick={onClose} className={cx('button-close')} midIcon={<CloseIcon />} circle></Button>
            </div>
        </div>
    );
}

LoginForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func,
};

export default LoginForm;
