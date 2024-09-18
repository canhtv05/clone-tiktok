import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useCallback, useState } from 'react';
import Tippy from '@tippyjs/react';
import styles from './BottomComment.module.scss';

import { AtSymbolIcon, EmojiIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function BottomComment({ onClick, inputRef, noPadding = false }) {
    const [isInputNotEmpty, setIsInputNotEmpty] = useState(false);

    const handleInputChange = useCallback((event) => {
        setIsInputNotEmpty(event.target.value.length > 0);
    }, []);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.keyCode === 13 && isInputNotEmpty) {
                e.preventDefault();
                onClick();
                setIsInputNotEmpty(false);
            }
        },
        [onClick, isInputNotEmpty],
    );

    return (
        <div className={cx('bottom-comment-container', { 'no-padding': noPadding })}>
            <div className={cx('div-wrapper-input')}>
                <div className={cx('wrapper-input')}>
                    <input
                        placeholder="Add comment..."
                        type="text"
                        className={cx('input-submit')}
                        onChange={handleInputChange}
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                    />
                    <div>
                        <Tippy content="“@” a user to tag them in your comments">
                            <span className={cx('at-symbol-icon')}>
                                <AtSymbolIcon style={{ color: 'var(--text-color)' }} />
                            </span>
                        </Tippy>
                    </div>
                    <div>
                        <Tippy content="Click to add emojis">
                            <span className={cx('emoji-icon')}>
                                <EmojiIcon style={{ color: 'var(--text-color)' }} />
                            </span>
                        </Tippy>
                    </div>
                </div>
                <div
                    onClick={onClick}
                    className={cx('button-submit', {
                        active: isInputNotEmpty,
                    })}
                >
                    Post
                </div>
            </div>
        </div>
    );
}

BottomComment.propTypes = {
    onClick: PropTypes.func,
    noPadding: PropTypes.bool,
};

export default BottomComment;
