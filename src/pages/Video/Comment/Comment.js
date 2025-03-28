import classNames from 'classnames/bind';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Comment.module.scss';
import Button from '~/components/Button';
import ProfileSection from './ProfileSection';
import CommentItem from './CommentItem';
import CreatorVideo from './CreatorVideo';
import { getAVideo } from '~/services/videos/getAVideo';
import ModalSuccess from '~/components/Modals/ModalSuccess';
import { setCommentCount } from '~/redux/slices/commentCountSlice';
import BottomAction from './BottomAction';
import { postCommentAPost } from '~/services/comments/postCommentAPost';
import { delCommentAPost } from '~/services/comments/delCommentAPost';
import { useLocation } from 'react-router-dom';
import { getVideosById } from '~/services/videos/getVideosById';
import { getListCommentAPost } from '~/services/comments/getListCommentAPost';
import { setChangeIndexVideo } from '~/redux/slices/changeIndexVideoSlice';
import { setCountComments } from '~/redux/slices/listVideosHomeSlice';

const cx = classNames.bind(styles);

function Comment() {
    const dispatch = useDispatch();
    const [typeMenu, setTypeMenu] = useState('comments');
    const [data, setData] = useState(null);
    const token = localStorage.getItem('token');
    const user = useSelector((state) => state.currentUser.currentUser);
    const infoUserCurrent = useSelector((state) => state.infoCurrentUser.infoCurrentUser);
    const [isPostComment, setIsPostComment] = useState(false);
    const [postCommentSuccess, setPostCommentSuccess] = useState(false);
    const [postValueComment, setPostValueComment] = useState([]);
    const [dataComment, setDataComment] = useState({});
    const [page, setPage] = useState(1);
    const [loadComment, setLoadComment] = useState(false);
    const [listCreatorVideo, setListCreatorVideo] = useState([]);
    const [listComment, setListComment] = useState([]);
    const [isLoadingComment, setIsLoadingComment] = useState(true);
    const [isLoadingCreator, setIsLoadingCreator] = useState(true);
    const [isMaxComment, setIsMaxComment] = useState(false);

    const imageCurrentUser = useSelector((state) => state.currentUserImage.currentUserImage);
    const fullName = useSelector((state) => state.fullNameCurrentUser.fullNameCurrentUser);
    const getCommentCount = useSelector((state) => state.commentCount.commentCount);
    const changeIndexVideo = useSelector((state) => state.changeIndexVideo.changeIndexVideo);
    const indexVideoHome = useSelector((state) => state.indexVideoHome.indexVideoHome);
    const idUser = useSelector((state) => state.idUser.idUser);

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const inputRefComment = useRef(null);
    const inputRefReplyComment = useRef(null);
    const listCommentRef = useRef(null);

    // const { id } = useParams();

    const location = useLocation();
    // const id = location.pathname.substring(7);
    const id = location.pathname.split('/')[2];

    useEffect(() => {
        if (changeIndexVideo) {
            setTypeMenu('comments');
            setDataComment({});
            setPostValueComment([]);
            setListComment([]);
            setIsLoadingComment(true);
            dispatch(setChangeIndexVideo(false));
        }
    }, [changeIndexVideo, dispatch]);

    useEffect(() => {
        // console.log(id);
        setPostValueComment([]);
        console.log(id);
        if (!id) return;

        (async () => {
            try {
                const res = await getAVideo(id, token);
                console.log(id);
                dispatch(setCommentCount(res.data.comments_count));
                setData(res.data);
                setDataComment(res.data);
            } catch (error) {
                console.log(error);
            }
        })();
        setLoadComment(false);
    }, [id, token, dispatch, location]);

    useEffect(() => {
        if (!idUser) return;
        const fetchVideos = async () => {
            try {
                setIsLoadingCreator(true);
                const res = await getVideosById(idUser);
                setListCreatorVideo(res);
            } catch (error) {
                console.log(error);
                setListCreatorVideo([]);
            } finally {
                setIsLoadingCreator(false);
            }
        };
        fetchVideos();
    }, [idUser, typeMenu]);

    const fetchApiComment = useCallback(async () => {
        try {
            const res = await getListCommentAPost(data?.id, token, page);

            if (res.data.length === 0) {
                setLoadComment(false);
                setIsMaxComment(true);
            } else if (res.meta.pagination.current_page >= res.meta.pagination.total_pages) {
                setLoadComment(false);
                setIsMaxComment(true);
            } else {
                setIsMaxComment(false);
            }

            const updateComment = res.data.map((item) => ({
                ...item,
                currentUserComment: item.user.nickname === user,
            }));

            // console.log(updateComment);

            setListComment((prev = []) => {
                const newComment = updateComment.filter((item) => !prev.some((comment) => comment.id === item.id));
                if (loadComment) {
                    return [...prev, ...newComment];
                }
                if (typeMenu === 'comments') {
                    return [...newComment, ...prev];
                }
                return prev;
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingComment(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.id, token, user, page, loadComment]);

    const handleClick = useCallback(() => {
        setListComment([]);
        setTypeMenu('comments');
        setDataComment(null);
        setPage(1);
        //
        // setLoadComment(true);
        //
        setPostValueComment([]);
        setIsLoadingComment(true);
        dispatch(setChangeIndexVideo(false));
        setIsLoadingComment(true);
    }, [dispatch]);

    useEffect(() => {
        if (idUser && data !== null) {
            if (loadComment) {
                fetchApiComment();
            } else {
                setPage(1);
                fetchApiComment();
            }
        }
    }, [fetchApiComment, idUser, page, data, loadComment]);

    useEffect(() => {
        if (typeMenu === 'creator') {
            fetchApiComment();
        }
    }, [fetchApiComment, typeMenu]);

    const handleSelectedMenu = (type) => {
        setTypeMenu(type);
    };

    const handlePostComment = useCallback(
        async (ref, replyNickname = null) => {
            if (id) {
                try {
                    const contentComment = replyNickname ? `@${replyNickname} ${ref.current.value}` : ref.current.value;
                    const res = await postCommentAPost(id, contentComment, token);
                    const newComment = {
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
                    };
                    setIsPostComment(true);
                    setPostCommentSuccess(true);
                    setPostValueComment((prevComments) => [...prevComments, newComment]);
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
                dispatch(setCountComments({ comments_count: getCommentCount + 1, indexVideo: indexVideoHome }));
            }
        },
        [
            token,
            day,
            fullName,
            imageCurrentUser,
            month,
            year,
            dispatch,
            getCommentCount,
            user,
            infoUserCurrent,
            id,
            indexVideoHome,
        ],
    );

    const handleDeleteComment = useCallback(
        async (commentId) => {
            if (!commentId) return;

            try {
                setListComment((prevComments) => prevComments.filter((comment) => comment.id !== commentId));

                setPostValueComment((prevComments) =>
                    prevComments.filter((comment) => comment.user.idComment !== commentId),
                );

                dispatch(setCommentCount(getCommentCount - 1));
                dispatch(setCountComments({ comments_count: getCommentCount - 1, indexVideo: indexVideoHome }));
                await delCommentAPost(commentId, token);
            } catch (error) {
                console.log(error);
            }
        },
        [dispatch, getCommentCount, token, indexVideoHome],
    );

    const handleScroll = useCallback(() => {
        if (loadComment === false && page === null) {
            return;
        }

        const scrollTop = listCommentRef.current.scrollTop;
        const containerHeight = listCommentRef.current.clientHeight;
        const contentHeight = listCommentRef.current.scrollHeight;

        if (Math.round(scrollTop) + containerHeight + 1 >= contentHeight && !isMaxComment) {
            setPage((prev) => prev + 1);
            setLoadComment(true);
        }
    }, [loadComment, page, isMaxComment]);

    const handleSelectedMenuComment = () => {
        handleSelectedMenu('comments');
    };

    const handleSelectedMenuCreator = () => {
        handleSelectedMenu('creator');
    };

    return (
        <div className={cx('container')}>
            <div className={cx('wrapper')}>
                <div className={cx('search-comment-container')}>
                    <div className={cx('comment-list-container')} ref={listCommentRef} onScroll={handleScroll}>
                        <ProfileSection data={data} />
                        <div className={cx('tab-menu-container')}>
                            <div className={cx('nav-menu')}>
                                <Button
                                    onClick={handleSelectedMenuComment}
                                    className={cx('nav-button', { active: typeMenu === 'comments' })}
                                >
                                    <span className={cx('title')}>
                                        Comments
                                        <span>{!isLoadingComment && '('}</span>
                                        <span>{!isLoadingComment && getCommentCount}</span>
                                        <span>{!isLoadingComment && ')'}</span>
                                    </span>
                                </Button>
                                <Button
                                    onClick={handleSelectedMenuCreator}
                                    className={cx('nav-button', { active: typeMenu === 'creator' })}
                                >
                                    <span className={cx('title')}>Creator videos</span>
                                </Button>
                                <div className={cx('tab-line')}></div>
                            </div>
                        </div>
                        {typeMenu === 'comments' && (
                            <CommentItem
                                data={dataComment}
                                valueComment={postValueComment}
                                onDeleteComment={handleDeleteComment}
                                onPostComment={(ref, replyNickname) => handlePostComment(ref, replyNickname)}
                                inputRef={inputRefReplyComment}
                                setPostValueComment={setPostValueComment}
                                listCommentItem={listComment}
                                isLoading={isLoadingComment}
                                commentsCount={getCommentCount}
                            />
                        )}
                        {typeMenu === 'creator' && (
                            <CreatorVideo
                                data={dataComment}
                                onClick={handleClick}
                                listCreatorVideo={listCreatorVideo}
                                isLoading={isLoadingCreator}
                            />
                        )}
                    </div>
                </div>
                {typeMenu === 'comments' && (
                    <BottomAction onClick={() => handlePostComment(inputRefComment)} inputRef={inputRefComment} />
                )}
                <ModalSuccess
                    title={postCommentSuccess ? 'Comment posted' : 'An error occurred. Please try again.'}
                    isShow={isPostComment}
                    setIsShow={setIsPostComment}
                    delay={600}
                />
            </div>
        </div>
    );
}

export default Comment;
