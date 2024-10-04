import classNames from 'classnames/bind';
import styles from './Live.module.scss';

const cx = classNames.bind(styles);

function Live() {
    document.title = 'For You - TikTok LIVE feed';

    return (
        <div className={cx('wrapper')}>
            <h2>Live page</h2>
        </div>
    );
}

export default Live;
