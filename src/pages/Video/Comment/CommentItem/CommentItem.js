import React, { createContext, memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './CommentItem.module.scss';
import { useNavigate } from 'react-router-dom';
import { renderEllipsisTippy } from '../TippyRenders';
import ModalSuccess from '~/components/Modals/ModalSuccess';
import { setNickName } from '~/redux/slices/nicknameSlice';
import { likeAComment } from '~/services/likes/likeAComment';
import { unlikeAComment } from '~/services/likes/unlikeAComment';
import { followAUser } from '~/services/follow/followAUser';
import { unfollowAUser } from '~/services/follow/unfollowAUser';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from '~/layouts/components/Sidebar/SuggestAccounts/AccountPreview';
import { setMyAccount } from '~/redux/slices/myAccountSlice';
import { setIdUser } from '~/redux/slices/idUserSlice';
import { setFollowingAUser } from '~/redux/slices/followingAUserSlice';
import { setProfile } from '~/redux/slices/profileSlice';
import RenderCommentsItem from './RenderCommentsItem';
import RenderMyComment from './RenderMyComment';

// chưa xử lý bình luận của video bản thân

const cx = classNames.bind(styles);

const itemLoading = new Array(6).fill(1);

const CommentItem = ({
    listCommentItem,
    data,
    valueComment,
    onDeleteComment,
    onPostComment,
    inputRef,
    setPostValueComment,
    isLoading,
    commentsCount,
}) => {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [listComment, setListComment] = useState(listCommentItem || []);
    const [isDeleted, setIsDeleted] = useState(false);
    const [delCommentSuccess, setDelCommentSuccess] = useState(false);
    const [replyIndex, setReplyIndex] = useState(null);
    const [listLike, setListLike] = useState([]);
    const [listFollowing, setListFollowing] = useState([]);
    const [followCurrentAccount, setFollowCurrentAccount] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);
    const CommentItemProvider = createContext();

    const user = useSelector((state) => state.currentUser.currentUser);
    const token = localStorage.getItem('token');

    const followingUser = useSelector((state) => state.followingUser.followingUser);
    const getNickname = useSelector((state) => state.getNickname.nickname);

    useEffect(() => {
        if (listCommentItem && listCommentItem.length !== 0) {
            setListComment(listCommentItem);
        } else {
            setListComment([]);
        }
    }, [listCommentItem]);

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

    useEffect(() => {
        if (valueComment.length !== 0) {
            setPostValueComment([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setPostValueComment]);

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
                if (commentId && showModalDelete && !isLoading) {
                    setIsDeleted(true);
                    setDelCommentSuccess(true);
                    setListComment((prev) => prev.filter((item) => item.id !== commentId));
                    setShowModalDelete(false);
                    // dispatch(setCountComments());
                    await onDeleteComment(commentId);
                }
            } catch (error) {
                console.log(error);
                setDelCommentSuccess(false);
                setShowModalDelete(false);
                return;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onDeleteComment, showModalDelete, isLoading, listComment],
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
            dispatch(setNickName(`@${nickname}`));
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

    if (commentsCount === 0 && valueComment.length === 0 && !isLoading && listComment.length === 0) {
        return (
            <div className={cx('comment-item-container', { 'no-comments': commentsCount === 0 })}>
                <span className={cx('no-comment')}>Be the first to comment {'<3'}</span>
            </div>
        );
    }

    return (
        <div className={cx('comment-item-container')}>
            <CommentItemProvider.Provider
                value={{
                    commentIdToDelete,
                    handleDeleteComment,
                    handleLikeCurrentUserComment,
                    handleNavigate,
                    handleReplyComment,
                    handleShowReply,
                    inputRef,
                    isLoading,
                    openDeleteModal,
                    renderEllipsisTippy,
                    renderPopper,
                    replyIndex,
                    valueComment,
                    setShowModalDelete,
                    showModalDelete,
                    data,
                    listComment,
                    listLike,
                    listFollowing,
                    handleLikeComment,
                    handleFollow,
                }}
            >
                <RenderMyComment
                    commentIdToDelete={commentIdToDelete}
                    handleDeleteComment={handleDeleteComment}
                    handleLikeCurrentUserComment={handleLikeCurrentUserComment}
                    handleNavigate={handleNavigate}
                    handleReplyComment={handleReplyComment}
                    handleShowReply={handleShowReply}
                    inputRef={inputRef}
                    isLoading={isLoading}
                    openDeleteModal={openDeleteModal}
                    renderEllipsisTippy={renderEllipsisTippy}
                    renderPopper={renderPopper}
                    replyIndex={replyIndex}
                    valueComment={valueComment}
                    setShowModalDelete={setShowModalDelete}
                    showModalDelete={showModalDelete}
                />
                <RenderCommentsItem
                    commentIdToDelete={commentIdToDelete}
                    data={data}
                    handleDeleteComment={handleDeleteComment}
                    handleFollow={handleFollow}
                    handleLikeComment={handleLikeComment}
                    handleReplyComment={handleReplyComment}
                    handleShowReply={handleShowReply}
                    inputRef={inputRef}
                    isLoading={isLoading}
                    listFollowing={listFollowing}
                    listLike={listLike}
                    listRender={listComment}
                    showModalDelete={showModalDelete}
                    openDeleteModal={openDeleteModal}
                    renderEllipsisTippy={renderEllipsisTippy}
                    replyIndex={replyIndex}
                    setShowModalDelete={setShowModalDelete}
                />
            </CommentItemProvider.Provider>
            {isDeleted && (
                <ModalSuccess title={delCommentSuccess ? 'Deleted' : 'An error occurred. Please try again.'} />
            )}
            {followCurrentAccount && <ModalSuccess title={"Couldn't follow user"} />}
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
