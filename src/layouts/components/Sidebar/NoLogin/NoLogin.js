import classNames from 'classnames/bind';
import styles from './NoLogin.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function NoLogin() {
    return (
        <div className={cx('wrapper')}>
            <p className={cx('paragraph')}>Log in to follow creators, like videos, and view comments.</p>
            <Button primary outline large className={cx('button')}>
                Login
            </Button>
        </div>
    );
}

export default NoLogin;
