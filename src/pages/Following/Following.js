import classNames from 'classnames/bind';
import styles from './Following.module.scss';

const cx = classNames.bind(styles);

function Following() {
    document.title = 'Following - Watch videos from creators you follow | TikTok';

    return (
        <div className={cx('wrapper')}>
            <h2>Following page</h2>
        </div>
    );
}

export default Following;
