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
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function Comment() {
    const dispatch = useDispatch();
    const [typeMenu, setTypeMenu] = useState('comments');
    const [data, setData] = useState(null);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const infoUserCurrent = useSelector((state) => state.infoCurrentUser.infoCurrentUser);
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

    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        setPostValueComment([]);
        const fetchApi = async () => {
            try {
                const res = await getAVideo(id, token);
                dispatch(setCommentCount(res.data.comments_count));
                setData(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        if (id) {
            fetchApi();
        }
    }, [token, dispatch, id]);

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
        setData(null);
    };

    const handlePostComment = useCallback(
        async (ref, replyNickname = null) => {
            if (id) {
                try {
                    const contentComment = replyNickname ? `@${replyNickname} ${ref.current.value}` : ref.current.value;
                    const res = await postCommentAPost(id, contentComment, token);
                    setIsPostComment(true);
                    setPostCommentSuccess(true);
                    setPostValueComment((prevComments) => [
                        ...prevComments,
                        {
                            user: {
                                avatar: imageCurrentUser,
                                fullName: fullName,
                                first_name: fullName.split(' ')[0],
                                last_name: fullName.split(' ')[1],
                                content: contentComment,
                                date: `${year}-${month}-${day}`,
                                idComment: res.data.id,
                                likesCount: Number(0),
                                isLike: false,
                                nickname: user,
                                bio: infoUserCurrent.bio,
                                followers_count: infoUserCurrent.followers,
                                likes_count: infoUserCurrent.likes,
                            },
                        },
                    ]);
                    if (ref.current) {
                        ref.current.value = '';
                        ref.current.focus();
                    }
                } catch (error) {
                    console.log(error);
                    setPostCommentSuccess(false);
                    return;
                }
                dispatch(setCommentCount(getCommentCount + 1));
            }
        },
        [token, day, fullName, imageCurrentUser, month, year, dispatch, getCommentCount, user, infoUserCurrent, id],
    );

    const handleDeleteComment = useCallback(
        async (commentId) => {
            if (!commentId) return;

            try {
                setPostValueComment((prevComments) =>
                    prevComments.filter((comment) => comment.user.idComment !== commentId),
                );

                dispatch(setCommentCount(getCommentCount - 1));
                await delCommentAPost(commentId, token);
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
                    <ProfileSection data={data} />
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
                            setPostValueComment={setPostValueComment}
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
