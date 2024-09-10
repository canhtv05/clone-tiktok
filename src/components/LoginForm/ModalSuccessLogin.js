import classNames from 'classnames/bind';
import styles from './LoginForm.module.scss';

const cx = classNames.bind(styles);

function ModalSuccess() {
    return (
        <div className={cx('modal-success')}>
            <div className={cx('notice')}>
                <div className={cx('notice-content')}>
                    <div className={cx('message')}>
                        <span>Logged in</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalSuccess;
