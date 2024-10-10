import React, { memo, useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './CommentItem.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import Image from '~/components/Image';
import { EllipsisIcon, LikeFillIcon, LikeIcon } from '~/components/Icons';
import TippyHeadless from '@tippyjs/react/headless';
import { renderEllipsisTippy } from '../TippyRenders';
import { getListCommentAPost } from '~/services/getListCommentAPost';
import ModalSuccess from '~/components/ModalSuccess';
import BottomAction from '../BottomAction';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { likeAComment } from '~/services/likeAComment';
import { unlikeAComment } from '~/services/unlikeAComment';
import { followAUser } from '~/services/followAUser';
import { unfollowAUser } from '~/services/unfollowAUser';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from '~/layouts/components/Sidebar/SuggestAccounts/AccountPreview';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { setFollowingAUser } from '~/redux/slices/followingAUserSlice';
import ModalDelete from '~/components/ModalDelete';
import { setProfile } from '~/redux/slices/profileSlice';

// chưa xử lý bình luận của video bản thân

const cx = classNames.bind(styles);

const itemLoading = new Array(6).fill(1);

const CommentItem = ({
    data,
    valueComment,
    onDeleteComment,
    onPostComment,
    inputRef,
    setPostValueComment,
    page,
    setPage,
    setLoadComment,
    loadComment,
}) => {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [listComment, setListComment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);
    const [delCommentSuccess, setDelCommentSuccess] = useState(false);
    const [replyIndex, setReplyIndex] = useState(null);
    const [listLike, setListLike] = useState([]);
    const [listFollowing, setListFollowing] = useState([]);
    const [followCurrentAccount, setFollowCurrentAccount] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const followingUser = useSelector((state) => state.followingUser.followingUser);
    const getNickname = useSelector((state) => state.getNickname.nickname);

    const fetchApi = useCallback(async () => {
        try {
            const res = await getListCommentAPost(data?.id, token, page);

            if (res.data.length === 0) {
                setLoadComment(false);
            } else if (res.meta.pagination.current_page === res.meta.pagination.total_pages) {
                setLoadComment(false);
            }
            const updateComment = res.data.map((item) => ({
                ...item,
                currentUserComment: item.user.nickname === user,
            }));
            setIsLoading(false);
            setListComment((prev) => [...prev, ...updateComment]);
        } catch (error) {
            console.log(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.id, token, user, page, setLoadComment]);

    useEffect(() => {
        if (data?.id) {
            setListComment([]);
            setIsLoading(true);
            setPage(1);
            fetchApi();
            setReplyIndex(null);
        }
    }, [data?.id, fetchApi, setPage]);

    useEffect(() => {
        const newListLike = [];
        if (listComment.length > 0) {
            listComment.forEach((item) => {
                newListLike.push({
                    nickname: item.user.nickname,
                    isLike: item.is_liked,
                    likesCount: item.likes_count,
                });
            });
        }
        setListLike(newListLike);
    }, [listComment]);

    useEffect(() => {
        const newListFollowing = listComment.map((item) => ({
            nickname: item.user.nickname,
            isFollowing: item.user.is_followed,
            idUser: item.user.id,
        }));
        if (valueComment.length) {
            const newValueComment = valueComment.map((_) => ({
                nickname: user,
                isFollowing: false,
            }));
            setListFollowing([...newValueComment, ...newListFollowing]);
        } else {
            setListFollowing(newListFollowing);
        }
    }, [listComment, valueComment, user]);

    useEffect(() => {
        if (isDeleted) {
            const timer = setTimeout(() => {
                setIsDeleted(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isDeleted]);

    useEffect(() => {
        if (followCurrentAccount) {
            setTimeout(() => {
                setFollowCurrentAccount(false);
            }, 600);
        }
    }, [followCurrentAccount]);

    useEffect(() => {
        const index = listFollowing.findIndex((user) => user.nickname === data?.user?.nickname);

        if (index !== -1) {
            const updateListFollow = [...listFollowing];

            updateListFollow[index] = {
                ...updateListFollow[index],
                isFollowing: followingUser,
            };

            setListFollowing(updateListFollow);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followingUser, data?.user?.nickname]);

    const handleLikeComment = useCallback(
        async (id, index) => {
            try {
                const updatedListLike = [...listLike];
                const likeInfo = updatedListLike[index];

                if (likeInfo && !likeInfo.isLike) {
                    likeInfo.isLike = true;
                    likeInfo.likesCount += 1;
                    setListLike(updatedListLike);
                    await likeAComment(id, token);
                } else {
                    likeInfo.isLike = false;
                    setListLike(updatedListLike);
                    likeInfo.likesCount = Math.max(likeInfo.likesCount - 1, 0);
                    await unlikeAComment(id, token);
                }
            } catch (error) {
                console.log(error);
            }
        },
        [listLike, token],
    );

    const handleLikeCurrentUserComment = useCallback(
        async (id, index) => {
            if (valueComment.length > 0) {
                const updatedComments = [...valueComment];
                const commentCurrentUser = updatedComments[index].user;

                try {
                    if (commentCurrentUser.isLike) {
                        commentCurrentUser.isLike = false;
                        commentCurrentUser.likesCount = Math.max(commentCurrentUser.likesCount - 1, 0);
                        await unlikeAComment(id, token);
                    } else {
                        commentCurrentUser.isLike = true;
                        commentCurrentUser.likesCount += 1;
                        await likeAComment(id, token);
                    }

                    setPostValueComment(updatedComments);
                } catch (error) {
                    console.log(error);
                }
            }
        },
        [valueComment, token, setPostValueComment],
    );

    const handleFollow = useCallback(
        async (list, index) => {
            if (list.nickname === user) {
                setFollowCurrentAccount(true);
                return;
            }
            try {
                const newListFollow = [...listFollowing];

                const nicknameToUpdate = listFollowing[index]?.nickname;
                if (newListFollow[index]?.isFollowing) {
                    newListFollow.forEach((item) => {
                        if (item.nickname === nicknameToUpdate) {
                            item.isFollowing = false;

                            if (item.idUser === data?.user_id && followingUser) {
                                dispatch(setFollowingAUser(false));
                            }
                        }
                    });
                    setListFollowing(newListFollow);
                    await unfollowAUser(list?.id, token);
                } else {
                    newListFollow.forEach((item) => {
                        if (item.nickname === nicknameToUpdate) {
                            item.isFollowing = true;

                            if (item.idUser === data?.user_id && !followingUser) {
                                dispatch(setFollowingAUser(true));
                            }
                        }
                    });
                    setListFollowing(newListFollow);
                    await followAUser(list?.id, token);
                }
            } catch (error) {
                console.log(error);
            }
        },
        [token, listFollowing, user, dispatch, followingUser, data?.user_id],
    );

    const handleDeleteComment = useCallback(
        async (commentId) => {
            try {
                if (commentId && showModalDelete) {
                    setIsDeleted(true);
                    setDelCommentSuccess(true);
                    setListComment((prev) => prev.filter((item) => item.id !== commentId));
                    await onDeleteComment(commentId);
                    setShowModalDelete(false);
                }
            } catch (error) {
                console.log(error);
                setDelCommentSuccess(false);
                setShowModalDelete(false);
                return;
            }
        },
        [onDeleteComment, showModalDelete],
    );

    const openDeleteModal = (commentId) => {
        setCommentIdToDelete(commentId);
        setShowModalDelete(true);
    };

    const handleShowReply = useCallback(
        (index) => {
            setReplyIndex(replyIndex === index ? null : index);
        },
        [replyIndex],
    );

    const handleReplyComment = useCallback(
        (replyNickname) => {
            if (inputRef.current) {
                onPostComment(inputRef, replyNickname);
            }
            setReplyIndex(null);
        },
        [onPostComment, inputRef],
    );

    const handleNavigate = useCallback(
        (nickname, idUser) => {
            if (nickname === user) {
                dispatch(setMyAccount(true));
            }
            if (nickname !== getNickname) {
                dispatch(setProfile({}));
            }
            dispatch(setIdUser(idUser));
            // dispatch(setNickName(`@${nickname}`));
            nav(`/profile/@${nickname}`);
        },
        [dispatch, user, nav, getNickname],
    );

    const renderPopper = useCallback(
        (data, index) => {
            return (
                <PopperWrapper>
                    <AccountPreview
                        data={data?.user}
                        showBio
                        onClick={() => handleFollow(data?.user, index)}
                        isFollowing={listFollowing[index]?.isFollowing}
                    />
                </PopperWrapper>
            );
        },
        [handleFollow, listFollowing],
    );

    const renderComments = useMemo(() => {
        return listComment.map((item, index) => (
            <span key={index}>
                <div className={cx('comment-content-container')}>
                    <span>
                        <TippyHeadless
                            render={() => renderPopper(item, index)}
                            interactive
                            offset={[140, 0]}
                            placement="bottom"
                            delay={[200, 200]}
                            popperOptions={{
                                modifiers: [
                                    {
                                        name: 'flip',
                                        options: {
                                            fallbackPlacements: [],
                                        },
                                    },
                                ],
                            }}
                        >
                            <Link
                                className={cx('styled-link-avatar')}
                                onClick={() => handleNavigate(item?.user.nickname)}
                                to={`/profile/@${item?.user.nickname}`}
                            >
                                <span className={cx('span-avatar-container')}>
                                    <Image
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            marginTop: '5px',
                                            objectFit: 'cover',
                                        }}
                                        src={item?.user?.avatar}
                                        className={cx('image-avatar')}
                                    />
                                </span>
                            </Link>
                        </TippyHeadless>
                    </span>
                    <div className={cx('content-container')}>
                        <Link
                            className={cx('styled-user-link-name')}
                            onClick={() => handleNavigate(item?.user.nickname, item?.user.id)}
                            to={`/profile/@${item?.user.nickname}`}
                        >
                            <span
                                className={cx('user-name-text')}
                            >{`${item?.user?.first_name} ${item?.user?.last_name || item?.user.nickname}`}</span>
                            {item?.user?.id === data?.user_id && (
                                <span>
                                    <span className={cx('dot')}>{' • '}</span>
                                    <span className={cx('author')}>{'Creator'}</span>
                                </span>
                            )}
                        </Link>
                        <p className={cx('comment-text')}>
                            <span>{item?.comment}</span>
                        </p>
                        <div className={cx('comment-sub-content')}>
                            <span className={cx('span-created-time')}>{`${item?.updated_at.split(' ')[0]}`}</span>
                            <span className={cx('span-reply-button')} onClick={() => handleShowReply(index)}>
                                {' Reply'}
                            </span>
                            {replyIndex === index && (
                                <div className={cx('wrapper-bottom-comment')}>
                                    <BottomAction
                                        noPadding
                                        onClick={() =>
                                            handleReplyComment(
                                                `${item?.user?.first_name} ${item?.user?.last_name || item?.user.nickname}`,
                                            )
                                        }
                                        inputRef={inputRef}
                                        onFocus
                                    />
                                    <span className={cx('icon-times')} onClick={handleShowReply}>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={cx('action-container-comment')}>
                        <div className={cx('like-wrapper')}>
                            <div className={cx('ellipsis-icon')}>
                                <TippyHeadless
                                    render={() =>
                                        renderEllipsisTippy(item?.currentUserComment, () =>
                                            openDeleteModal(item?.currentUserComment ? item.id : undefined),
                                        )
                                    }
                                    placement="bottom"
                                    interactive
                                    offset={[-80, 10]}
                                    popperOptions={{
                                        modifiers: [
                                            {
                                                name: 'flip',
                                                options: {
                                                    fallbackPlacements: [],
                                                },
                                            },
                                        ],
                                    }}
                                >
                                    <span>
                                        <EllipsisIcon />
                                    </span>
                                </TippyHeadless>
                            </div>
                            <div className={cx('like-icon')} onClick={() => handleLikeComment(item.id, index)}>
                                {listLike[index]?.isLike ? (
                                    <LikeFillIcon style={{ color: 'var(--primary)' }} />
                                ) : (
                                    <LikeIcon />
                                )}
                            </div>
                            <div className={cx('span-count')}>{listLike[index]?.likesCount}</div>
                        </div>
                    </div>
                </div>
                {showModalDelete && (
                    <ModalDelete
                        title={'Are you sure you want to delete this comment?'}
                        onDelete={() => handleDeleteComment(commentIdToDelete)}
                        onClose={() => setShowModalDelete(false)}
                    />
                )}
                {loadComment && data && <div className={cx('tiktok-loader')}></div>}
            </span>
        ));
    }, [
        handleDeleteComment,
        data,
        handleLikeComment,
        handleNavigate,
        handleReplyComment,
        handleShowReply,
        commentIdToDelete,
        inputRef,
        listComment,
        listLike,
        renderPopper,
        replyIndex,
        loadComment,
        showModalDelete,
    ]);

    if (isLoading) {
        return (
            <div className={cx('comment-item-container', { loading: isLoading })}>
                {itemLoading.map((_, index) => (
                    <div className={cx('div-loading')} key={index}>
                        <div className={cx('styled-link-avatar', { loading: isLoading })}></div>
                        <div className={cx('comment-content-container', { loading: isLoading })}>
                            <div className={cx('styled-user-link-name', { loading: isLoading })}></div>
                            <p className={cx('comment-text', { loading: isLoading })}></p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (data?.comments_count === 0 && !isLoading && valueComment.length === 0) {
        return (
            <div className={cx('comment-item-container', { 'no-comments': data?.comments_count === 0 })}>
                <span className={cx('no-comment')}>Be the first to comment</span>
            </div>
        );
    }

    return (
        <div className={cx('comment-item-container')}>
            {valueComment.length > 0 &&
                valueComment
                    .slice()
                    .reverse()
                    .map((comment, index) => (
                        <div key={index} className={cx('comment-content-container')}>
                            <span>
                                <TippyHeadless
                                    render={() => renderPopper(comment, index)}
                                    interactive
                                    offset={[140, 0]}
                                    placement="bottom"
                                    delay={[200, 200]}
                                    popperOptions={{
                                        modifiers: [
                                            {
                                                name: 'flip',
                                                options: {
                                                    fallbackPlacements: [],
                                                },
                                            },
                                        ],
                                    }}
                                >
                                    <Link
                                        className={cx('styled-link-avatar')}
                                        onClick={() => handleNavigate(comment.user.nickname)}
                                        to={`/profile/@${comment.user.nickname}`}
                                    >
                                        <span className={cx('span-avatar-container')}>
                                            <Image
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    marginTop: '5px',
                                                    objectFit: 'cover',
                                                }}
                                                src={comment.user.avatar}
                                                className={cx('image-avatar')}
                                            />
                                        </span>
                                    </Link>
                                </TippyHeadless>
                            </span>
                            <div className={cx('content-container')}>
                                <Link
                                    className={cx('styled-user-link-name')}
                                    to={`/profile/@${comment.user.fullName}`}
                                    onClick={() => handleNavigate(comment.user.nickname)}
                                >
                                    <span className={cx('user-name-text')}>{comment.user.fullName}</span>
                                </Link>
                                <p className={cx('comment-text')}>
                                    <span>{comment.user.content}</span>
                                </p>
                                <div className={cx('comment-sub-content')}>
                                    <span className={cx('span-created-time')}>{comment.user.date}</span>
                                    <span
                                        className={cx('span-reply-button')}
                                        onClick={() => handleShowReply(index - valueComment.length)}
                                    >
                                        {' Reply'}
                                    </span>
                                    {replyIndex === index - valueComment.length && (
                                        <div className={cx('wrapper-bottom-comment')}>
                                            <BottomAction
                                                noPadding
                                                onClick={() => handleReplyComment(`${comment.user.fullName}`)}
                                                inputRef={inputRef}
                                                onFocus
                                            />
                                            <span className={cx('icon-times')} onClick={handleShowReply}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={cx('action-container-comment')}>
                                <div className={cx('like-wrapper')}>
                                    <div className={cx('ellipsis-icon')}>
                                        <TippyHeadless
                                            render={() =>
                                                renderEllipsisTippy(true, () => openDeleteModal(comment.user.idComment))
                                            }
                                            placement="bottom"
                                            interactive
                                            offset={[-80, 10]}
                                            popperOptions={{
                                                modifiers: [
                                                    {
                                                        name: 'flip',
                                                        options: {
                                                            fallbackPlacements: [],
                                                        },
                                                    },
                                                ],
                                            }}
                                        >
                                            <span>
                                                <EllipsisIcon />
                                            </span>
                                        </TippyHeadless>
                                    </div>
                                    <div
                                        className={cx('like-icon')}
                                        onClick={() => handleLikeCurrentUserComment(comment.user.idComment, index)}
                                    >
                                        {comment.user.isLike ? (
                                            <LikeFillIcon style={{ color: 'var(--primary)' }} />
                                        ) : (
                                            <LikeIcon />
                                        )}
                                    </div>
                                    <div className={cx('span-count')}>{comment.user.likesCount}</div>
                                </div>
                            </div>
                            {showModalDelete && (
                                <ModalDelete
                                    title={'Are you sure you want to delete this comment?'}
                                    onDelete={() => handleDeleteComment(commentIdToDelete)}
                                    onClose={() => setShowModalDelete(false)}
                                />
                            )}
                        </div>
                    ))}
            {followCurrentAccount && <ModalSuccess title={"Couldn't follow user"} />}
            {renderComments}
            {isDeleted && (
                <ModalSuccess title={delCommentSuccess ? 'Deleted' : 'An error occurred. Please try again.'} />
            )}
        </div>
    );
};

CommentItem.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.number,
        comments_count: PropTypes.number,
        user_id: PropTypes.number,
    }),
    valueComment: PropTypes.arrayOf(
        PropTypes.shape({
            idComment: PropTypes.number,
            avatar: PropTypes.string,
            fullName: PropTypes.string,
            content: PropTypes.string,
            date: PropTypes.string,
            nickname: PropTypes.string,
        }),
    ),
    onDeleteComment: PropTypes.func,
};
export default memo(CommentItem);
