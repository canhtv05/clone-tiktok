import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './NoLogin.module.scss';
import Button from '~/components/Button';
import LoginModal from '~/components/LoginForm';

const cx = classNames.bind(styles);

function NoLogin() {
    const [showLoginForm, setShowLoginForm] = useState(false);

    const handleLoginClick = () => {
        setShowLoginForm(true);
    };

    return (
        <div className={cx('wrapper')}>
            <p className={cx('paragraph')}>Log in to follow creators, like videos, and view comments.</p>
            <Button onClick={handleLoginClick} primary outline large className={cx('button')}>
                Login
            </Button>
            {showLoginForm && (
                <LoginModal isShowModalLoginForm={showLoginForm} setIsShowModalLoginForm={setShowLoginForm} />
            )}
        </div>
    );
}

export default NoLogin;
