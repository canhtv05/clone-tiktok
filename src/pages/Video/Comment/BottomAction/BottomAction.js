import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import styles from './BottomAction.module.scss';

import { AtSymbolIcon, EmojiIcon, ImageIcon, MessageFill2Icon } from '~/components/Icons';

const cx = classNames.bind(styles);

function BottomAction({ onClick, inputRef, noPadding = false, onFocus = false, classname = '', typeMessage = false }) {
    const [isInputNotEmpty, setIsInputNotEmpty] = useState(false);

    useEffect(() => {
        if (onFocus) {
            inputRef.current.focus();
        }
    }, [inputRef, onFocus]);

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
        <div className={cx('bottom-comment-container', { 'no-padding': noPadding, message: typeMessage }, classname)}>
            <div className={cx('div-wrapper-input')}>
                <div className={cx('wrapper-input')}>
                    <input
                        placeholder={typeMessage ? 'Send a message' : 'Add comment...'}
                        type="text"
                        className={cx('input-submit')}
                        onChange={handleInputChange}
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                    />
                    <div>
                        <Tippy
                            content={typeMessage ? 'Click to send media' : '“@” a user to tag them in your comments'}
                        >
                            <span className={cx('at-symbol-icon')}>
                                {typeMessage ? (
                                    <ImageIcon style={{ color: 'var(--text-color)' }} />
                                ) : (
                                    <AtSymbolIcon style={{ color: 'var(--text-color)' }} />
                                )}
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
                    {typeMessage ? <MessageFill2Icon /> : 'Post'}
                </div>
            </div>
        </div>
    );
}

BottomAction.propTypes = {
    onClick: PropTypes.func,
    noPadding: PropTypes.bool,
    padding: PropTypes.bool,
    onFocus: PropTypes.bool,
    classname: PropTypes.string,
    typeMessage: PropTypes.bool,
};

export default BottomAction;
