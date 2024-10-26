import classNames from 'classnames/bind';
import styles from './Following.module.scss';
import FollowingNotLogin from './FollowingNotLogin';

const cx = classNames.bind(styles);

function Following() {
    document.title = 'Following - Watch videos from creators you follow | TikTok';

    const token = localStorage.getItem('token');

    return <div className={cx('container')}>{!token && <FollowingNotLogin />}</div>;
}

export default Following;
