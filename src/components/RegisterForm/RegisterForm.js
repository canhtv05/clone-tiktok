import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './RegisterForm.module.scss';
import { Link } from 'react-router-dom';
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

function RegisterForm({ onClose }) {
    const handleClose = () => {
        onClose();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('overlay')} onClick={onClose}></div>
            <div className={cx('login-container')}>
                <div className={cx('modal-content')}>
                    <div className={cx('div-login')}>
                        <div className={cx('div-home-container')}>
                            <h2 className={cx('login-title')}>Log in to TikTok</h2>
                        </div>
                    </div>
                    <div className={cx('register')}>
                        <div className={cx('dont-account')}>Don’t have an account?</div>
                        <Link to={'/'}>
                            <span className={cx('span-link')}>Sign up</span>
                        </Link>
                    </div>
                </div>
                <Button onClick={handleClose} className={cx('button-close')} midIcon={<CloseIcon />} circle></Button>
            </div>
        </div>
    );
}

RegisterForm.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default RegisterForm;
