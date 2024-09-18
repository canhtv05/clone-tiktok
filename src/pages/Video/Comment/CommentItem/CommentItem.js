import React, { memo, useCallback, useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './CommentItem.module.scss';
import { Link } from 'react-router-dom';
import Image from '~/components/Image';
import { EllipsisIcon, LikeIcon } from '~/components/Icons';
import TippyHeadless from '@tippyjs/react/headless';
import { renderEllipsisTippy } from '../TippyRenders';
import { getListCommentAPost } from '~/services/getListCommentAPost';
import { delCommentAPost } from '~/services/delCommentAPost';
import ModalSuccess from '~/components/ModalSuccess';
import { setCommentCount } from '~/redux/slices/commentCountSlice';
import BottomComment from '../BottomComment';

// chưa xử lý bình luận của video bản thân

const cx = classNames.bind(styles);

const itemLoading = new Array(6).fill(1);

const CommentItem = ({ data, valueComment = null, onDeleteComment, onPostComment, inputRef }) => {
    const dispatch = useDispatch();
    const [listComment, setListComment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);
    const [delCommentSuccess, setDelCommentSuccess] = useState(false);
    const [toggleLike, setToggleLike] = useState(false);
    const [replyIndex, setReplyIndex] = useState(null);
    const [showReplyCurrentUser, setShowReplyCurrentUser] = useState(false);

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
        if (isDeleted) {
            const timer = setTimeout(() => {
                setIsDeleted(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isDeleted]);

    const handleDeleteComment = useCallback(
        async (commentId) => {
            try {
                setDelCommentSuccess(true);
                onDeleteComment(commentId);
                setIsDeleted(true);
                dispatch(setCommentCount(getCommentCount - 1));
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

    const handleLikeIcon = () => {
        setToggleLike((prev) => !prev);
    };

    const handleShowReply = (index) => {
        setReplyIndex(replyIndex === index ? null : index);
    };

    const handleShowReplyCurrentUser = () => {
        setShowReplyCurrentUser(true);
    };

    const handleReplyComment = useCallback(
        (replyNickname) => {
            if (inputRef.current) {
                onPostComment(inputRef, replyNickname);
            }
            setReplyIndex(null);
            setShowReplyCurrentUser(false);
        },
        [onPostComment, inputRef],
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

    return (
        <div className={cx('comment-item-container')}>
            {valueComment.length !== 0 &&
                valueComment
                    .slice()
                    .reverse()
                    .map((comment, index) => (
                        <div key={index} className={cx('comment-content-container')}>
                            <Link className={cx('styled-link-avatar')}>
                                <span className={cx('span-avatar-container')}>
                                    <Image
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            marginTop: '5px',
                                            objectFit: 'cover',
                                        }}
                                        src={comment.avatar}
                                        className={cx('image-avatar')}
                                    />
                                </span>
                            </Link>
                            <div className={cx('content-container')}>
                                <Link className={cx('styled-user-link-name')}>
                                    <span className={cx('user-name-text')}>{comment.nickname}</span>
                                </Link>
                                <p className={cx('comment-text')}>
                                    <span>{comment.content}</span>
                                </p>
                                <div className={cx('comment-sub-content')}>
                                    <span className={cx('span-created-time')}>{comment.date}</span>
                                    <span
                                        className={cx('span-reply-button')}
                                        onClick={() => handleShowReply(index - valueComment.length)}
                                    >
                                        {' Reply'}
                                    </span>
                                    {replyIndex === index - valueComment.length && (
                                        <BottomComment
                                            noPadding
                                            onClick={() => handleReplyComment(`${comment.nickname}`)}
                                            inputRef={inputRef}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className={cx('action-container-comment')}>
                                <div className={cx('like-wrapper')}>
                                    <div className={cx('ellipsis-icon')}>
                                        <TippyHeadless
                                            render={() =>
                                                renderEllipsisTippy(true, () => handleDeleteComment(comment.idComment))
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
                                    <div className={cx('like-icon')} onClick={handleLikeIcon}>
                                        {toggleLike && <div style={{ color: 'var(--text-color)' }}>ok</div>}
                                        <LikeIcon />
                                    </div>
                                    <div className={cx('span-count')}>{comment.likes_count}</div>
                                </div>
                            </div>
                        </div>
                    ))}
            {listComment.map((item, index) => (
                <div key={index} className={cx('comment-content-container')}>
                    <Link className={cx('styled-link-avatar')}>
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
                    <div className={cx('content-container')}>
                        <Link className={cx('styled-user-link-name')}>
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
                                <BottomComment
                                    noPadding
                                    onClick={() =>
                                        handleReplyComment(
                                            `${item?.user?.first_name} ${item?.user?.last_name || item?.user.nickname}`,
                                        )
                                    }
                                    inputRef={inputRef}
                                />
                            )}
                            {/* {item?.comment.startsWith('@') && <div style={{ color: 'red' }}>ok</div>}
                                    {replyCommentSuccess && <div>{valueComment[0]?.content}</div>} */}
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
                            <div className={cx('like-icon')} onClick={handleLikeIcon}>
                                {toggleLike && <div style={{ color: 'var(--text-color)' }}>ok</div>}
                                <LikeIcon />
                            </div>
                            <div className={cx('span-count')}>{`${item?.likes_count}`}</div>
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
            nickname: PropTypes.string,
            content: PropTypes.string,
            date: PropTypes.string,
        }),
    ),
    onDeleteComment: PropTypes.func,
};
export default memo(CommentItem);
