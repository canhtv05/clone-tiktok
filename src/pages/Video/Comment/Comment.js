import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import { Fragment, useCallback, useState } from 'react';
import styles from './Comment.module.scss';
import Button from '~/components/Button';
import ProfileSection from './ProfileSection';
import CommentItem from './CommentItem';
import { AtSymbolIcon, EmojiIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function Comment() {
    const [typeMenu, setTypeMenu] = useState('comments');
    const [isInputNotEmpty, setIsInputNotEmpty] = useState(false);

    const handleSelectedMenu = (type) => {
        setTypeMenu(type);
    };

    const handleInputChange = useCallback((event) => {
        setIsInputNotEmpty(event.target.value.length > 0);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('search-comment-container')}>
                <div className={cx('comment-list-container')}>
                    <ProfileSection />
                    <div className={cx('tab-menu-container')}>
                        <div className={cx('nav-menu')}>
                            <Button
                                onClick={() => handleSelectedMenu('comments')}
                                className={cx('nav-button', { active: typeMenu === 'comments' })}
                            >
                                <span className={cx('title')}>Comments{` (2)`}</span>
                            </Button>
                            <Button
                                onClick={() => handleSelectedMenu('creator')}
                                className={cx('nav-button', { active: typeMenu === 'creator' })}
                            >
                                <span className={cx('title')}>Creator videos</span>
                            </Button>
                            <div className={cx('tab-line')}></div>
                        </div>
                    </div>
                    <CommentItem />
                </div>
            </div>
            <div className={cx('bottom-comment-container')}>
                <div className={cx('div-wrapper-input')}>
                    <div className={cx('wrapper-input')}>
                        <input
                            placeholder="Add comment..."
                            type="text"
                            className={cx('input-submit')}
                            onChange={handleInputChange}
                        />
                        <div>
                            <Tippy content="“@” a user to tag them in your comments">
                                <span className={cx('at-symbol-icon')}>
                                    <AtSymbolIcon />
                                </span>
                            </Tippy>
                        </div>
                        <div>
                            <Tippy content="Click to add emojis">
                                <span className={cx('emoji-icon')}>
                                    <EmojiIcon />
                                </span>
                            </Tippy>
                        </div>
                    </div>
                    <div
                        className={cx('button-submit', {
                            active: isInputNotEmpty,
                        })}
                    >
                        Post
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;
