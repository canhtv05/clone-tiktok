import classNames from 'classnames/bind';
import styles from './Article.module.scss';
import images from '~/assets/images';
import { Link } from 'react-router-dom';
import { MusicNoticeIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function Article() {
    return (
        <article className={cx('container')}>
            <div className={cx('wrapper-content')}>
                <section className={cx('media-card-container')}>
                    <div className={cx('base-player-container')}>
                        <div className={cx('video-container')}>
                            <video src="" poster={images.avatar} className={cx('video')}></video>
                        </div>
                        <div className={cx('media-card-bottom')}>
                            <div className={cx('author-container')}>
                                <div className={cx('author')}>
                                    <Link className={cx('link-author')}>
                                        <h3 className={cx('author-nickname')}>mr.canh05</h3>
                                        <span style={{ margin: '0 2px' }}>·</span>
                                        <span className={cx('post-time')}>17h ago</span>
                                    </Link>
                                </div>
                            </div>
                            <div className={cx('desc-wrapper')}>
                                <div className={cx('multiple-text-container')}>
                                    <div className={cx('multi-line-text')}>
                                        <h1 className={cx('h1-container')}>
                                            <span className={cx('span-text')}>Thuật ngữ trong ngành mới hiểu </span>
                                        </h1>
                                    </div>
                                    <button className={cx('button-bottom')}>more</button>
                                </div>
                            </div>
                            <div className={cx('music-and-icon-container')}>
                                <h4 className={cx('h4-link')}>
                                    <Link className={cx('link-music')}>
                                        <MusicNoticeIcon />
                                        <span className={cx('music-text')}>nhạc nền - phù thỉ</span>
                                    </Link>
                                </h4>
                            </div>
                        </div>
                        <div className={cx('seek-bar-container')}>
                            <p className={cx('timing')}>10/10</p>
                            <div className={cx('seek-bar')}>
                                <div className={cx('circle-icon')}></div>
                                <div className={cx('div-seek-bar')}>
                                    <input type="range" className={cx('progress')} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={cx('action-bar-container')}></section>
            </div>
        </article>
    );
}

export default Article;
