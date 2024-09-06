import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import Aside from './Aside';
import Comment from './Comment';

const cx = classNames.bind(styles);

function Video() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('aside')}>
                <Aside />
            </div>
            <div className={cx('comment')}>
                <Comment />
            </div>
        </div>
    );
}

export default Video;
