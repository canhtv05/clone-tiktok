import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './LoginForm.module.scss';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { CloseIcon, FBIcon, GoogleIcon, KaKaoIcon, LineIcon, UserIcon } from '../Icons';
import Button from '../Button';
import SignupFormItem from './SignupFormItem';
import ModalSuccess from '../Modals/ModalSuccess';

const cx = classNames.bind(styles);

const menuItem = [
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
        title: 'Continue with Line',
        disable: true,
        icon: <LineIcon />,
    },
    {
        title: 'Continue with KaKaoTalk',
        disable: true,
        icon: <KaKaoIcon />,
    },
];

function SignupForm({ onClose, onShowLoginForm }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);

    useEffect(() => {
        if (isSignupSuccess) {
            const timer = setTimeout(() => {
                setIsSignupSuccess(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isSignupSuccess]);

    const handleMenuClick = (item) => {
        if (!item.disable) {
            setSelectedItem(item);
        }
    };

    const handleCloseAllModals = useCallback(() => {
        setSelectedItem(null);
        onClose();
    }, [onClose]);

    const handleBackToLogin = () => {
        setSelectedItem(null);
    };

    return (
        <div className={cx('wrapper')}>
            {isSignupSuccess && <ModalSuccess title="Sign up successfully!" />}
            <div className={cx('overlay')} onClick={onClose}></div>
            <div className={cx('login-container')}>
                <div className={cx('modal-content')}>
                    <div className={cx('div-login')}>
                        <div className={cx('div-home-container')}>
                            <h2 className={cx('login-title')}>Sign up for TikTok</h2>
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
                        <div className={cx('dont-account')}>Already have an account? </div>
                        <div onClick={onShowLoginForm} style={{ cursor: 'pointer' }}>
                            <span className={cx('span-link')}>Log in</span>
                        </div>
                    </div>
                    {selectedItem && (
                        <SignupFormItem
                            onClose={handleCloseAllModals}
                            onBack={handleBackToLogin}
                            onShowLoginForm={onShowLoginForm}
                            setIsSignupSuccess={setIsSignupSuccess}
                        />
                    )}
                </div>
                <Button onClick={onClose} className={cx('button-close')} midIcon={<CloseIcon />} circle></Button>
            </div>
        </div>
    );
}

SignupForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSignupSuccess: PropTypes.func,
};

export default SignupForm;
