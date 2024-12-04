import classNames from 'classnames/bind';
import styles from './Explore.module.scss';
import HeaderExplore from './HeaderExplore/HeaderExplore';

const cx = classNames.bind(styles);

function Explore() {
    document.title = 'Explore - Find your favourite videos on TikTok';

    return (
        <div className={cx('wrapper')}>
            <HeaderExplore />
            <h2>Explore page</h2>
        </div>
    );
}

export default Explore;
