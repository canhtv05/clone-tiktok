import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './CommentItem.module.scss';
import { Link } from 'react-router-dom';
import Image from '~/components/Image';
import { EllipsisIcon, LikeIcon } from '~/components/Icons';
import TippyHeadless from '@tippyjs/react/headless';
import { renderEllipsisTippy } from '../TippyRenders';
import { getListCommentAPost } from '~/services/getListCommentAPost';

const cx = classNames.bind(styles);

const itemLoading = new Array(6).fill(1);

const CommentItem = ({ data }) => {
    const [listComment, setListComment] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (data?.id) {
            setIsLoading(true);
            setListComment(null);
            const fetchApi = async () => {
                try {
                    const res = await getListCommentAPost(data?.id, token);
                    const timer = setTimeout(() => {
                        setListComment(res.data || []);
                        setIsLoading(false);
                    }, 0);

                    return () => clearTimeout(timer);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchApi();
        }
    }, [data?.id, token]);

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

    if (data?.comments_count === 0 && !isLoading) {
        return (
            <div className={cx('comment-item-container', { 'no-comments': data?.comments_count === 0 })}>
                <span className={cx('no-comment')}>Be the first to comment 😘</span>
            </div>
        );
    }

    return (
        <div className={cx('comment-item-container')}>
            {!isLoading &&
                listComment &&
                listComment.map((item, index) => (
                    <div key={index} className={cx('comment-content-container')}>
                        <Link className={cx('styled-link-avatar')}>
                            <span className={cx('span-avatar-container')}>
                                <Image
                                    style={{ width: 40, height: 40, borderRadius: '50%', marginTop: '5px' }}
                                    src={item?.user?.avatar}
                                    className={cx('image-avatar')}
                                />
                            </span>
                        </Link>
                        <div className={cx('content-container')}>
                            <Link className={cx('styled-user-link-name')}>
                                <span
                                    className={cx('user-name-text')}
                                >{`${item?.user?.first_name} ${item?.user?.last_name}`}</span>
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
                                        render={renderEllipsisTippy}
                                        placement="bottom"
                                        interactive
                                        offset={[-80, 10]}
                                        visible
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
        </div>
    );
};

CommentItem.propTypes = {
    data: PropTypes.object,
};

export default memo(CommentItem);
