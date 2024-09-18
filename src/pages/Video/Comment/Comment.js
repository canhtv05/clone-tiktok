import classNames from 'classnames/bind';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Comment.module.scss';
import Button from '~/components/Button';
import ProfileSection from './ProfileSection';
import CommentItem from './CommentItem';
import CreatorVideo from './CreatorVideo';
import { getAVideo } from '~/services/getAVideo';
import ModalSuccess from '~/components/ModalSuccess';
import { setCommentCount } from '~/redux/slices/commentCountSlice';
import BottomComment from './BottomComment';
import { postCommentAPost } from '~/services/postCommentAPost';
import { delCommentAPost } from '~/services/delCommentAPost';

const cx = classNames.bind(styles);

function Comment() {
    const dispatch = useDispatch();
    const [typeMenu, setTypeMenu] = useState('comments');
    const [data, setData] = useState(null);
    const token = localStorage.getItem('token');
    const [dataProfile, setDataProfile] = useState(null);
    const indexVideo = useSelector((state) => state.indexVideo.index);
    const listVideo = useSelector((state) => state.listVideo.listVideo);
    const [isPostComment, setIsPostComment] = useState(false);
    const [postCommentSuccess, setPostCommentSuccess] = useState(false);
    const [postValueComment, setPostValueComment] = useState([]);

    const imageCurrentUser = useSelector((state) => state.currentUserImage.currentUserImage);
    const fullName = useSelector((state) => state.fullNameCurrentUser.fullNameCurrentUser);
    const getCommentCount = useSelector((state) => state.commentCount.commentCount);

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const inputRefComment = useRef(null);
    const inputRefReplyComment = useRef(null);

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

    const handleClick = () => {
        setTypeMenu('comments');
        setData(listVideo[indexVideo]);
    };

    const handlePostComment = useCallback(
        async (ref, replyNickname = null) => {
            if (listVideo[indexVideo]?.uuid) {
                try {
                    const contentComment = replyNickname ? `@${replyNickname} ${ref.current.value}` : ref.current.value;
                    const res = await postCommentAPost(listVideo[indexVideo]?.uuid, contentComment, token);
                    setIsPostComment(true);
                    setPostCommentSuccess(true);
                    setPostValueComment((prevComments) => [
                        ...prevComments,
                        {
                            avatar: imageCurrentUser,
                            nickname: fullName,
                            content: contentComment,
                            date: `${year}-${month}-${day}`,
                            idComment: res.data.id,
                        },
                    ]);
                    if (ref.current) {
                        ref.current.value = '';
                    }
                } catch (error) {
                    console.log(error);
                    setPostCommentSuccess(false);
                    return;
                }
                dispatch(setCommentCount(getCommentCount + 1));
            }
        },
        [indexVideo, token, listVideo, day, fullName, imageCurrentUser, month, year, dispatch, getCommentCount],
    );

    const handleDeleteComment = useCallback(
        async (commentId) => {
            if (!commentId) return;

            try {
                setPostValueComment((prevComments) =>
                    prevComments.filter((comment) => comment.idComment !== commentId),
                );
                await delCommentAPost(commentId, token);
                dispatch(setCommentCount(getCommentCount - 1));
            } catch (error) {
                console.log(error);
            }
        },
        [dispatch, getCommentCount, token],
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
                            onPostComment={(ref, replyNickname) => handlePostComment(ref, replyNickname)}
                            inputRef={inputRefReplyComment}
                        />
                    )}
                    {typeMenu === 'creator' && <CreatorVideo data={data} onClick={handleClick} />}
                </div>
            </div>
            <BottomComment onClick={() => handlePostComment(inputRefComment)} inputRef={inputRefComment} />
            {isPostComment && (
                <ModalSuccess title={postCommentSuccess ? 'Comment posted' : 'An error occurred. Please try again.'} />
            )}
        </div>
    );
}

export default Comment;
