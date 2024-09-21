import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './CommentItem.module.scss';
import { Link } from 'react-router-dom';
import Image from '~/components/Image';
import { EllipsisIcon, LikeFillIcon, LikeIcon } from '~/components/Icons';
import TippyHeadless from '@tippyjs/react/headless';
import { renderEllipsisTippy } from '../TippyRenders';
import { getListCommentAPost } from '~/services/getListCommentAPost';
import ModalSuccess from '~/components/ModalSuccess';
import { setCommentCount } from '~/redux/slices/commentCountSlice';
import BottomComment from '../BottomComment';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { likeAComment } from '~/services/likeAComment';
import { unlikeAComment } from '~/services/unlikeAComment';
import { followAUser } from '~/services/followAUser';
import { unfollowAUser } from '~/services/unfollowAUser';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from '~/layouts/components/Sidebar/SuggestAccounts/AccountPreview';

// chưa xử lý bình luận của video bản thân

const cx = classNames.bind(styles);

const itemLoading = new Array(6).fill(1);

const CommentItem = ({ data, valueComment = null, onDeleteComment, onPostComment, inputRef, setPostValueComment }) => {
    const dispatch = useDispatch();
    const [listComment, setListComment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);
    const [delCommentSuccess, setDelCommentSuccess] = useState(false);
    const [replyIndex, setReplyIndex] = useState(null);
    const [listLike, setListLike] = useState([]);
    const [listFollowing, setListFollowing] = useState([]);
    const [followCurrentAccount, setFollowCurrentAccount] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const getCommentCount = useSelector((state) => state.commentCount.commentCount);

    const fetchApi = useCallback(async () => {
        try {
            const res = await getListCommentAPost(data?.id, token);
            const updateComment = res.data.map((item) => ({
                ...item,
                currentUserComment: item.user.nickname === user,
            }));
            setListComment(updateComment || []);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }, [data?.id, token, user]);

    useEffect(() => {
        if (data?.id) {
            setIsLoading(true);
            fetchApi();
            setReplyIndex(null);
        }
    }, [data?.id, fetchApi]);

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
        }));
        setListFollowing(newListFollowing);
    }, [listComment]);

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

                //set state để re-render
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
                const commentCurrentUser = updatedComments[index];
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
        async (data, index) => {
            if (data.nickname === user) {
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
                        }
                    });
                    setListFollowing(newListFollow);
                    await unfollowAUser(data?.id, token);
                } else {
                    newListFollow.forEach((item) => {
                        if (item.nickname === nicknameToUpdate) {
                            item.isFollowing = true;
                        }
                    });
                    setListFollowing(newListFollow);
                    await followAUser(data?.id, token);
                }
            } catch (error) {
                console.log(error);
            }
        },
        [token, listFollowing, user],
    );

    const handleDeleteComment = useCallback(
        async (commentId) => {
            try {
                setDelCommentSuccess(true);
                onDeleteComment(commentId);
                setIsDeleted(true);
                dispatch(setCommentCount(Math.max(getCommentCount - 1, 0)));
            } catch (error) {
                console.log(error);
                setDelCommentSuccess(false);
                return;
            }

            if (!valueComment.length) {
                fetchApi();
            }
        },
        [onDeleteComment, fetchApi, valueComment, dispatch, getCommentCount],
    );

    const handleShowReply = (index) => {
        setReplyIndex(replyIndex === index ? null : index);
    };

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
        (nickname) => {
            dispatch(setNickName(`@${nickname}`));
        },
        [dispatch],
    );

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

    const renderPopper = (data, index) => {
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
    };

    return (
        <div className={cx('comment-item-container')}>
            {valueComment.length !== 0 &&
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
                                >
                                    <Link
                                        className={cx('styled-link-avatar')}
                                        to={`/profile/@${comment.user.fullName}`}
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
                                <Link className={cx('styled-user-link-name')} to={`/profile/${comment.user.fullName}`}>
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
                                        <BottomComment
                                            noPadding
                                            onClick={() => handleReplyComment(`${comment.user.fullName}`)}
                                            inputRef={inputRef}
                                            onFocus
                                        />
                                    )}
                                </div>
                            </div>
                            <div className={cx('action-container-comment')}>
                                <div className={cx('like-wrapper')}>
                                    <div className={cx('ellipsis-icon')}>
                                        <TippyHeadless
                                            render={() =>
                                                renderEllipsisTippy(true, () =>
                                                    handleDeleteComment(comment.user.idComment),
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
                        </div>
                    ))}
            {followCurrentAccount && <ModalSuccess title={"Couldn't follow user"} />}
            {listComment.map((item, index) => (
                <div key={index} className={cx('comment-content-container')}>
                    <span>
                        <TippyHeadless
                            render={() => renderPopper(item, index)}
                            interactive
                            offset={[140, 0]}
                            placement="bottom"
                            delay={[200, 200]}
                        >
                            <Link
                                className={cx('styled-link-avatar')}
                                onClick={() => handleNavigate(item?.user.fullName)}
                                to={`/profile/${item?.user.fullName}`}
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
                            onClick={() => handleNavigate(item?.user.fullName)}
                            to={`/profile/${item?.user.fullName}`}
                        >
                            <span
                                className={cx('user-name-text')}
                            >{`${item?.user?.first_name} ${item?.user?.last_name || item?.user.fullName}`}</span>
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
                                <BottomComment
                                    noPadding
                                    onClick={() =>
                                        handleReplyComment(
                                            `${item?.user?.first_name} ${item?.user?.last_name || item?.user.fullName}`,
                                        )
                                    }
                                    inputRef={inputRef}
                                    onFocus
                                />
                            )}
                        </div>
                    </div>
                    <div className={cx('action-container-comment')}>
                        <div className={cx('like-wrapper')}>
                            <div className={cx('ellipsis-icon')}>
                                <TippyHeadless
                                    render={() =>
                                        renderEllipsisTippy(item?.currentUserComment, () =>
                                            handleDeleteComment(item?.currentUserComment ? item.id : undefined, token),
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
            ))}
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
