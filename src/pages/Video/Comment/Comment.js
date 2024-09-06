import classNames from 'classnames/bind';
import styles from './Comment.module.scss';

const cx = classNames.bind(styles);

function Comment() {
    return (
        <div className={cx('wrapper')}>
            <h1>Comment</h1>
        </div>
    );
}

export default Comment;
