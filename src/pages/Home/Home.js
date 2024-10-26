import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Article from './Article';

const cx = classNames.bind(styles);

function Home() {
    document.title = 'TikTok - Make Your Day';
    return (
        <div className={cx('container')}>
            <div className={cx('wrapper')}>
                <div className={cx('column-container')}>
                    <div className={cx('colum-list-container')}>
                        <Article />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
