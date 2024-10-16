import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './EmojiContainer.module.scss';

const cx = classNames.bind(styles);

const listEmoji = [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '😍',
    '😘',
    '😗',
    '😚',
    '😙',
    '😋',
    '😛',
    '😜',
    '😝',
    '🤑',
    '🤗',
    '🤔',
    '🤐',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '🤥',
    '😌',
    '😔',
    '😪',
    '🤤',
    '😴',
    '😷',
    '🤒',
    '🤕',
    '🤢',
    '🤧',
    '😵',
    '🤠',
    '😎',
    '🤓',
    '😕',
    '😟',
    '🙁',
    '😮',
    '😯',
    '😲',
    '😳',
    '😦',
    '😧',
    '😨',
    '😰',
    '😥',
    '😢',
    '😭',
    '😱',
    '😖',
    '😣',
    '😞',
    '😓',
    '😩',
    '😫',
    '😤',
    '😡',
    '😠',
    '😈',
    '👿',
    '💀',
    '💩',
    '🤡',
    '👹',
    '👺',
    '👻',
    '👽',
    '👾',
    '🤖',
    '😺',
    '😸',
    '😹',
    '😻',
    '😼',
    '😽',
    '🙀',
    '😿',
    '😾',
];

function EmojiContainer({ onClick }) {
    const handleClickEmoji = (emoji) => {
        if (onClick) {
            onClick(emoji);
        }
    };
    return (
        <div className={cx('emoji-container')}>
            <div className={cx('panel-container')}>
                <ul className={cx('panel-list')}>
                    {listEmoji.map((item, index) => (
                        <li key={index} className={cx('emoji-item')} onClick={() => handleClickEmoji(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <ul className={cx('nav-container')}>
                <li className={cx('icon-item')} onClick={() => handleClickEmoji('😊')}>
                    😊
                </li>
            </ul>
        </div>
    );
}

EmojiContainer.propTypes = {
    onClick: PropTypes.func,
};

export default EmojiContainer;
