import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useRef, useState } from 'react';
import Tippy from '@tippyjs/react';
import styles from './BottomAction.module.scss';

import { AtSymbolIcon, EmojiIcon, ImageIcon, MessageFill2Icon } from '~/components/Icons';
import EmojiContainer from './EmojiContainer';

const cx = classNames.bind(styles);

function BottomAction({ onClick, inputRef, noPadding = false, onFocus = false, classname = '', typeMessage = false }) {
    const [isInputNotEmpty, setIsInputNotEmpty] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [countChar, setCountChar] = useState(0);

    const inputContainerRef = useRef();
    const spanRef = useRef();

    useEffect(() => {
        if (onFocus) {
            inputRef.current.focus();
        }
    }, [inputRef, onFocus]);

    const handleInputAddEmoji = useCallback(
        (emoji) => {
            const input = inputRef.current;
            if (typeMessage) {
                if (countChar >= 6000) {
                    input.value = input.value.substring(0, 6002);
                    return;
                }
            } else {
                if (countChar >= 150) {
                    input.value = input.value.substring(0, 152);
                    return;
                }
            }
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const newValue = input.value.substring(0, start) + emoji + input.value.substring(end);

            const refSpan = spanRef.current;
            input.style.height = '40px';
            let scrollHeight = input.scrollHeight;
            input.style.height = `${scrollHeight}px`;

            if (scrollHeight >= 70) {
                input.style.marginBottom = '30px';
                input.style.marginTop = '6px';
                refSpan.style.display = 'inline-block';
            } else {
                input.style.marginBottom = '0px';
                input.style.marginTop = '0px';
                refSpan.style.display = 'none';
            }

            input.value = newValue;
            input.setSelectionRange(start + emoji.length, start + emoji.length);
            setCountChar(Array.from(newValue).length);
            setIsInputNotEmpty(Array.from(newValue).length > 0);
            input.focus();
        },
        [inputRef, countChar, typeMessage],
    );

    const handleInputChange = useCallback(
        (event) => {
            const refInput = event.target;
            let newValue = refInput.value;

            if (typeMessage) {
                if (newValue.length >= 6000) {
                    newValue = newValue.slice(0, 6000);
                }
            } else {
                if (newValue.length >= 150) {
                    newValue = newValue.slice(0, 150);
                }
            }

            refInput.value = newValue;
            const refSpan = spanRef.current;
            refInput.style.height = '40px';
            let scrollHeight = refInput.scrollHeight;
            refInput.style.height = `${scrollHeight}px`;
            if (scrollHeight >= 70) {
                refInput.style.marginBottom = '30px';
                refInput.style.marginTop = '6px';
                refSpan.style.display = 'inline-block';
            } else {
                refInput.style.marginBottom = '0px';
                refInput.style.marginTop = '0px';
                refSpan.style.display = 'none';
            }

            setCountChar(Array.from(newValue).length);
            setIsInputNotEmpty(Array.from(newValue).length > 0);
        },
        [typeMessage],
    );

    useEffect(() => {
        const refSpan = spanRef.current;
        if (typeMessage) {
            if (countChar >= 6000) {
                refSpan.style.color = 'var(--primary)';
                return;
            } else {
                refSpan.style.color = 'var(--opacity-text)';
            }
        } else {
            if (countChar >= 150) {
                refSpan.style.color = 'var(--primary)';
                return;
            } else {
                refSpan.style.color = 'var(--opacity-text)';
            }
        }
    }, [countChar, typeMessage]);

    const handleSubmit = useCallback(
        (e) => {
            if (isInputNotEmpty) {
                const refSpan = spanRef.current;
                const refInput = inputRef.current;
                e.preventDefault();
                onClick();
                setShowEmojiPicker(false);
                setIsInputNotEmpty(false);
                setCountChar(0);
                refSpan.style.display = 'none';
                refInput.style.marginBottom = '0px';
                refInput.style.height = '40px';
                refInput.style.marginTop = '0px';
            }
        },
        [isInputNotEmpty, onClick, inputRef],
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.keyCode === 13) {
                handleSubmit(e);
            }
        },
        [handleSubmit],
    );

    const handleShowMenuIcon = (e) => {
        e.stopPropagation();
        setShowEmojiPicker((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputContainerRef.current && !inputContainerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cx('bottom-comment-container', { 'no-padding': noPadding, message: typeMessage }, classname)}>
            <div className={cx('div-wrapper-input')} ref={inputContainerRef}>
                <div className={cx('wrapper-input')}>
                    <textarea
                        placeholder={typeMessage ? 'Send a message' : 'Add comment...'}
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
                            <span className={cx('emoji-icon')} onMouseDown={handleShowMenuIcon}>
                                <EmojiIcon style={{ color: 'var(--text-color)' }} />
                            </span>
                        </Tippy>
                        {showEmojiPicker && (
                            <div className={cx('wrapper-menu')}>
                                <EmojiContainer onClick={handleInputAddEmoji} />
                            </div>
                        )}
                    </div>
                    <span className={cx('count-line')} ref={spanRef}>
                        {countChar}/{typeMessage ? 6000 : 150}
                    </span>
                </div>
                <div
                    onClick={handleSubmit}
                    className={cx('button-submit', {
                        active: isInputNotEmpty,
                    })}
                >
                    {typeMessage ? (
                        <div className={cx('icon-submit')}>
                            <MessageFill2Icon />
                        </div>
                    ) : (
                        <span style={{ alignSelf: 'flex-end' }}>Post</span>
                    )}
                </div>
            </div>
        </div>
    );
}

BottomAction.propTypes = {
    onClick: PropTypes.func,
    noPadding: PropTypes.bool,
    onFocus: PropTypes.bool,
    classname: PropTypes.string,
    typeMessage: PropTypes.bool,
};

export default BottomAction;
