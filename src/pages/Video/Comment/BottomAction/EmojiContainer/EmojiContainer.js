import classNames from 'classnames/bind';
import styles from './EmojiContainer.module.scss';

const cx = classNames.bind(styles);

const listEmoji = ['😀', '😃'];

function EmojiContainer() {
    return (
        <div className={cx('emoji-container')}>
            <div className={cx('panel-container')}></div>
            <ul className={cx('nav-container')}>
                <li className={cx('icon-item')}>😊</li>
            </ul>
        </div>
    );
}

export default EmojiContainer;
