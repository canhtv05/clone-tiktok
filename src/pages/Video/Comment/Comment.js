import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Comment.module.scss';
import Button from '~/components/Button';
import ProfileSection from './ProfileSection';
import CommentItem from './CommentItem';
import { AtSymbolIcon, EmojiIcon } from '~/components/Icons';
import CreatorVideo from './CreatorVideo';
import { getAVideo } from '~/services/getAVideo';
import { postCommentAPost } from '~/services/postCommentAPost';
import ModalSuccess from '~/components/ModalSuccess';
import { setCommentCount } from '~/redux/slices/commentCountSlice';

const cx = classNames.bind(styles);

function Comment() {
    const dispatch = useDispatch();
    const [typeMenu, setTypeMenu] = useState('comments');
    const [isInputNotEmpty, setIsInputNotEmpty] = useState(false);
    const [data, setData] = useState(null);
    const token = localStorage.getItem('token');
    const [dataProfile, setDataProfile] = useState(null);
    const indexVideo = useSelector((state) => state.indexVideo.index);
    const listVideo = useSelector((state) => state.listVideo.listVideo);
    const [isPostComment, setIsPostComment] = useState(false);
    const [postCommentSuccess, setPostCommentSuccess] = useState(false);
    const [postValueComment, setPostValueComment] = useState([]);
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const imageCurrentUser = useSelector((state) => state.currentUserImage.currentUserImage);
    const getCommentCount = useSelector((state) => state.commentCount.commentCount);
    const fullName = useSelector((state) => state.fullNameCurrentUser.fullNameCurrentUser);

    const inputRef = useRef();

    useEffect(() => {
        setPostValueComment([]);
        const fetchApi = async () => {
            try {
                const res = await getAVideo(listVideo[indexVideo].uuid, token);
                dispatch(setCommentCount(res.data.comments_count));
                setDataProfile(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        if (listVideo[indexVideo]?.uuid) {
            fetchApi();
        }
        setData(listVideo[indexVideo]);
    }, [indexVideo, listVideo, token, dispatch]);

    useEffect(() => {
        if (isPostComment) {
            const timer = setTimeout(() => {
                setIsPostComment(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isPostComment]);

    const handleSelectedMenu = (type) => {
        setTypeMenu(type);
    };

    const handleInputChange = useCallback((event) => {
        setIsInputNotEmpty(event.target.value.length > 0);
    }, []);

    const handleClick = () => {
        setTypeMenu('comments');
        setData(listVideo[indexVideo]);
    };

    const handlePostComment = useCallback(async () => {
        if (listVideo[indexVideo]?.uuid) {
            try {
                const res = await postCommentAPost(listVideo[indexVideo]?.uuid, inputRef.current.value, token);
                setIsPostComment(true);
                setIsInputNotEmpty(false);
                setPostCommentSuccess(true);
                setPostValueComment([
                    {
                        avatar: imageCurrentUser,
                        nickname: fullName,
                        content: inputRef.current.value,
                        date: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
                        idComment: res.data.id,
                    },
                ]);
                inputRef.current.value = '';
            } catch (error) {
                console.log(error);
                setPostCommentSuccess(false);
                return;
            }
            dispatch(setCommentCount(getCommentCount + 1));
        }
    }, [
        indexVideo,
        token,
        listVideo,
        day,
        fullName,
        imageCurrentUser,
        month,
        year,
        dispatch,
        getCommentCount,
        hours,
        minutes,
        seconds,
    ]);

    const handleDeleteComment = () => {
        setPostValueComment([]);
        return true;
    };

    const handleKeyDown = useCallback(
        (e) => {
            if (e.keyCode === 13 && isInputNotEmpty) {
                e.preventDefault();
                handlePostComment();
            }
        },
        [handlePostComment, isInputNotEmpty],
    );

    return (
        <div className={cx('wrapper')}>
            <div className={cx('search-comment-container')}>
                <div className={cx('comment-list-container')}>
                    <ProfileSection data={dataProfile} />
                    <div className={cx('tab-menu-container')}>
                        <div className={cx('nav-menu')}>
                            <Button
                                onClick={() => handleSelectedMenu('comments')}
                                className={cx('nav-button', { active: typeMenu === 'comments' })}
                            >
                                <span className={cx('title')}>
                                    Comments
                                    <span>{' ('}</span>
                                    <span>{getCommentCount}</span>
                                    <span>{')'}</span>
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
                    {typeMenu === 'comments' && (
                        <CommentItem
                            data={data}
                            valueComment={postValueComment}
                            onDeleteComment={handleDeleteComment}
                        />
                    )}
                    {typeMenu === 'creator' && <CreatorVideo data={data} onClick={handleClick} />}
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
                            ref={inputRef}
                            onKeyDown={handleKeyDown}
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
                        onClick={handlePostComment}
                        className={cx('button-submit', {
                            active: isInputNotEmpty,
                        })}
                    >
                        Post
                    </div>
                </div>
            </div>
            {isPostComment && (
                <ModalSuccess title={postCommentSuccess ? 'Comment posted' : 'An error occurred. Please try again.'} />
            )}
        </div>
    );
}

export default Comment;
