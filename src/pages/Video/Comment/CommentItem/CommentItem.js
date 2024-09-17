import React, { memo, useCallback, useEffect, useState } from 'react';
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

// chưa xử lý bình luận của video bản thân

const cx = classNames.bind(styles);

const itemLoading = new Array(6).fill(1);

const CommentItem = ({ data, valueComment = null, onDeleteComment }) => {
    const dispatch = useDispatch();
    const [listComment, setListComment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);
    const [delCommentSuccess, setDelCommentSuccess] = useState(false);
    const getCommentCount = useSelector((state) => state.commentCount.commentCount);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

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
        async (commentId, token) => {
            try {
                onDeleteComment();
                setIsDeleted(true);
                setDelCommentSuccess(true);
                dispatch(setCommentCount(getCommentCount - 1));
                await delCommentAPost(commentId, token);
            } catch (error) {
                console.log(error);
                setDelCommentSuccess(false);
                return;
            }
            fetchApi();
        },
        [onDeleteComment, fetchApi, dispatch, getCommentCount],
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
            {valueComment.length !== 0 && (
                <div className={cx('comment-content-container')}>
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
                                src={valueComment[0].avatar}
                                className={cx('image-avatar')}
                            />
                        </span>
                    </Link>
                    <div className={cx('content-container')}>
                        <Link className={cx('styled-user-link-name')}>
                            <span className={cx('user-name-text')}>{valueComment[0]?.nickname}</span>
                            {/* {userId === data?.user_id && (
                                <span>
                                    <span className={cx('dot')}>{' • '}</span>
                                    <span className={cx('author')}>{'Creator'}</span>
                                </span>
                            )} */}
                        </Link>
                        <p className={cx('comment-text')}>
                            <span>{valueComment[0].content}</span>
                        </p>
                        <p className={cx('comment-sub-content')}>
                            <span className={cx('span-created-time')}>{valueComment[0].date}</span>
                            <span className={cx('span-reply-button')}>{' Reply'}</span>
                        </p>
                    </div>
                    <div className={cx('action-container-comment')}>
                        <div className={cx('like-wrapper')}>
                            <div className={cx('ellipsis-icon')}>
                                <TippyHeadless
                                    render={() =>
                                        renderEllipsisTippy(true, () =>
                                            handleDeleteComment(valueComment[0].idComment, token),
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
                            <div className={cx('like-icon')}>
                                <LikeIcon />
                            </div>
                            <div className={cx('span-count')}>0</div>
                        </div>
                    </div>
                </div>
            )}
            {!isLoading &&
                listComment.map((item, index) => (
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
                                >{`${item?.user?.first_name || 'No'} ${item?.user?.last_name || 'name'}`}</span>
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
                            <p className={cx('comment-sub-content')}>
                                <span className={cx('span-created-time')}>{`${item?.updated_at.split(' ')[0]}`}</span>
                                <span className={cx('span-reply-button')}>{' Reply'}</span>
                            </p>
                        </div>
                        <div className={cx('action-container-comment')}>
                            <div className={cx('like-wrapper')}>
                                <div className={cx('ellipsis-icon')}>
                                    <TippyHeadless
                                        render={() =>
                                            renderEllipsisTippy(item?.currentUserComment, () =>
                                                handleDeleteComment(
                                                    item?.currentUserComment ? item.id : undefined,
                                                    token,
                                                ),
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
                                <div className={cx('like-icon')}>
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
