import classNames from 'classnames/bind';
import { createPortal } from 'react-dom';
import styles from './Video.module.scss';
import Aside from './Aside';
import Comment from './Comment';

const cx = classNames.bind(styles);

function Video() {
    return createPortal(
        <div className={cx('wrapper')}>
            <div className={cx('aside')}>
                <Aside />
            </div>
            <div className={cx('comment')}>
                <Comment />
            </div>
        </div>,
        document.getElementById('root'),
    );
}

export default Video;
