import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import avatar from '~/assets/images/avatar/sanji.jpg';

const cx = classNames.bind(styles);

function AccountItem() {
    return (
        <div className={cx('wrapper')}>
            <img className={cx('avatar')} src={avatar} alt="someone" />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>Mr.Rain</span>
                    <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                </h4>
                <span className={cx('username')}>rain1710</span>
            </div>
        </div>
    );
}

export default AccountItem;
