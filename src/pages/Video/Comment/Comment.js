import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './Comment.module.scss';
import Button from '~/components/Button';
import ProfileSection from './ProfileSection';
import CommentItem from './CommentItem';
import { AtSymbolIcon, EmojiIcon } from '~/components/Icons';
import CreatorVideo from './CreatorVideo';

const cx = classNames.bind(styles);

function Comment() {
    const [typeMenu, setTypeMenu] = useState('comments');
    const [isInputNotEmpty, setIsInputNotEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);

    const indexVideo = useSelector((state) => state.indexVideo.index);
    const listVideo = useSelector((state) => state.listVideo.listVideo);

    useEffect(() => {
        if (listVideo) {
            setIsLoading(true);
            setData(null);

            const timer = setTimeout(() => {
                setData(listVideo[indexVideo]);
                setIsLoading(false);
            }, 400);

            return () => clearTimeout(timer);
        }
    }, [indexVideo, listVideo]);

    const handleSelectedMenu = (type) => {
        setTypeMenu(type);
    };

    const handleInputChange = useCallback((event) => {
        setIsInputNotEmpty(event.target.value.length > 0);
    }, []);

    const handleClick = () => {
        setTypeMenu('comments');
        setIsLoading(true);
        setData(null);

        const timer = setTimeout(() => {
            setData(listVideo[indexVideo]);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('search-comment-container')}>
                <div className={cx('comment-list-container')}>
                    <ProfileSection data={data} isLoading={isLoading} />
                    <div className={cx('tab-menu-container')}>
                        <div className={cx('nav-menu')}>
                            <Button
                                onClick={() => handleSelectedMenu('comments')}
                                className={cx('nav-button', { active: typeMenu === 'comments' })}
                            >
                                <span className={cx('title')}>
                                    Comments
                                    {!isLoading && <span>{' ('}</span>}
                                    {!isLoading && `${data?.comments_count || '0'}`}
                                    {!isLoading && <span>{')'}</span>}
                                </span>
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
                    {typeMenu === 'comments' && <CommentItem data={data} isLoading={isLoading} />}
                    {typeMenu === 'creator' && <CreatorVideo data={data} onClick={handleClick} isLoading={isLoading} />}
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
