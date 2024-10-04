import classNames from 'classnames/bind';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

function Home() {
    document.title = 'TikTok - Make Your Day';
    return (
        <div className={cx('wrapper')}>
            <h2>Home page</h2>
        </div>
    );
}

export default Home;
