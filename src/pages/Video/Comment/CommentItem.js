import React from 'react';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import { Link } from 'react-router-dom';
import Image from '~/components/Image';
import images from '~/assets/images';
import { EllipsisIcon, LikeIcon } from '~/components/Icons';
import TippyHeadless from '@tippyjs/react/headless';
import { renderEllipsisTippy } from './TippyRenders';

const cx = classNames.bind(styles);

const CommentItem = () => (
    <div className={cx('comment-item-container')}>
        <div className={cx('comment-content-container')}>
            <Link className={cx('styled-link-avatar')}>
                <span style={{ width: 40, height: 40 }} className={cx('span-avatar-container')}>
                    <Image src={images.avatar} className={cx('image-avatar')} />
                </span>
            </Link>
            <div className={cx('content-container')}>
                <Link className={cx('styled-user-link-name')}>
                    <span className={cx('user-name-text')}>Ốc🐌(lilykim)</span>
                </Link>
                <p className={cx('comment-text')}>
                    <span>Ib m kéo</span>
                </p>
                <p className={cx('comment-sub-content')}>
                    <span className={cx('span-created-time')}>2023-11-17</span>
                    <span className={cx('span-reply-button')}>Reply</span>
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
                    <div className={cx('span-count')}>0</div>
                </div>
            </div>
        </div>
    </div>
);

export default CommentItem;
