import { Link } from 'react-router-dom';
import { useState, useRef, memo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Article.module.scss';
import { setProfile } from '~/redux/slices/profileSlice';
import { MusicNoticeIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function MediaCardBottomArticle({ data, divTextRef, spanTextRef, isTooLong }) {
    const dispatch = useDispatch();
    const [isClickMore, setIsClickMore] = useState(false);

    const divMultiLineTextRef = useRef();

    const handleShowMoreText = () => {
        if (!isClickMore) {
            divMultiLineTextRef.current.style.setProperty('-webkit-box-orient', 'unset');
            divMultiLineTextRef.current.style.setProperty('-webkit-line-clamp', 'unset');
            setIsClickMore(true);
        }
    };

    const handleLessText = () => {
        if (isClickMore) {
            divMultiLineTextRef.current.style.setProperty('-webkit-box-orient', 'vertical');
            divMultiLineTextRef.current.style.setProperty('-webkit-line-clamp', '1');
            setIsClickMore(false);
        }
    };

    const handleToProfile = () => {
        dispatch(setProfile({}));
    };

    return (
        <div className={cx('media-card-bottom')}>
            <div className={cx('author-container')}>
                <div className={cx('author')}>
                    <Link
                        className={cx('link-author')}
                        to={`/profile/@${data?.user?.nickname}`}
                        onClick={handleToProfile}
                    >
                        <h3 className={cx('author-nickname')}>
                            {data?.user?.nickname.trim().length !== 0
                                ? data?.user?.nickname
                                : `${data?.user?.first_name} ${data?.user?.last_name}`}
                        </h3>
                    </Link>
                    <span style={{ margin: '0 2px', color: 'var(--white)' }}>·</span>
                    <span className={cx('post-time')}>{data?.updated_at.split(' ')[0]}</span>
                </div>
            </div>
            <div className={cx('desc-wrapper')} ref={divTextRef}>
                <div className={cx('multiple-text-container')}>
                    <div className={cx('multi-line-text')} ref={divMultiLineTextRef}>
                        <h1 className={cx('h1-container')}>
                            <span className={cx('span-text')} ref={spanTextRef}>
                                {data?.description}
                            </span>
                        </h1>
                    </div>
                    {isTooLong &&
                        (isClickMore ? (
                            <button className={cx('button-bottom')} onClick={handleLessText}>
                                less
                            </button>
                        ) : (
                            <button className={cx('button-bottom')} onClick={handleShowMoreText}>
                                more
                            </button>
                        ))}
                </div>
            </div>
            <div className={cx('music-and-icon-container')}>
                <h4 className={cx('h4-link')}>
                    <Link className={cx('link-music')}>
                        <MusicNoticeIcon />
                        <span className={cx('music-text')}>{data?.music || 'Copyright by Canhtv05'}</span>
                    </Link>
                </h4>
            </div>
        </div>
    );
}

MediaCardBottomArticle.propTypes = {
    data: PropTypes.shape({
        user: PropTypes.shape({
            nickname: PropTypes.string.isRequired,
            first_name: PropTypes.string.isRequired,
            last_name: PropTypes.string.isRequired,
        }).isRequired,
        updated_at: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        music: PropTypes.string.isRequired,
    }),
    divTextRef: PropTypes.shape({
        current: PropTypes.instanceOf(HTMLDivElement),
    }).isRequired,
    spanTextRef: PropTypes.shape({
        current: PropTypes.instanceOf(HTMLSpanElement),
    }).isRequired,
    isTooLong: PropTypes.bool.isRequired,
};

export default memo(MediaCardBottomArticle);
